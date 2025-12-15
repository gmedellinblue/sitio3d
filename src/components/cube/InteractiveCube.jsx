import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export default function InteractiveCube() {
  const { scene: cubeScene } = useGLTF('/models/cube.glb')
  const { scene: sphereScene } = useGLTF('/models/sphere.glb')
  const cubeRef = useRef()
  const sphereRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const targetRotation = useRef(new THREE.Vector2(0, 0))
  const SPHERE_ROTATION_SPEED = 2

  useFrame((state, delta) => {
    if (!cubeRef.current) return

    const time = state.clock.elapsedTime
    if (!isHovered) {
      targetRotation.current.x = Math.sin(time * 0.5) * 0.05
      targetRotation.current.y = Math.sin(time * 0.3) * 0.05
    }
    if (isHovered) {
      targetRotation.current.x = -state.mouse.y * 1.5
      targetRotation.current.y = state.mouse.x * 1.5
    }
    cubeRef.current.rotation.x = THREE.MathUtils.lerp(
      cubeRef.current.rotation.x,
      targetRotation.current.x,
      0.1
    )
    cubeRef.current.rotation.y = THREE.MathUtils.lerp(
      cubeRef.current.rotation.y,
      targetRotation.current.y,
      0.1
    )
    cubeRef.current.position.y = Math.sin(time) * 0.1

    if (isHovered && sphereRef.current) {
      sphereRef.current.rotation.y += delta * SPHERE_ROTATION_SPEED
    }
  })

  return (
    <group
      ref={cubeRef}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <primitive object={cubeScene} />
      <primitive
        ref={sphereRef}
        object={sphereScene}
        scale={0.5}
        position={[0, 0, 0]}
      />
    </group>
  )
}
