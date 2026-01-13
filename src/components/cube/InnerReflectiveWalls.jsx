import { MeshReflectorMaterial } from '@react-three/drei'
import { useAppState } from '../../context/AppStateContext'
import { useEffect } from 'react'

export default function InnerReflectiveWalls() {
  const { mode } = useAppState()

  let color = "#ffffff" 
  let roughness = 0.9
  let mirror = 1
  let opacity = 0.1
  let metalness = 0.1

  if (mode.includes('food')) {
     color = "#88ff8814"
     opacity = 0.4
  } else if (mode.includes('water')) {
     color = "#8888ff1a"
     opacity = 0.4
  } else if (mode.includes('resources')) {
     color = "#ff888817"
     opacity = 0.4
  }

  const reflectorProps = {
    resolution: 1024,
    mixBlur: 3,      
    mixStrength: 5,
    blur: [300, 100],
    minDepthThreshold: .5,
    maxDepthThreshold: .8,
    depthScale: 4,
    depthToBlurRatioBias: 1,
    color: color,
    metalness: metalness,
    roughness: roughness,
    mirror: mirror,
    far: 1, 
  }
  const wallSize = [1.85, 1.85] 
  const distance = 1.01

  return (
    <group>
      <mesh position={[0, -distance, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={wallSize} />
        <MeshReflectorMaterial {...reflectorProps} />
      </mesh>

      <mesh position={[0, distance, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={wallSize} />
        <MeshReflectorMaterial {...reflectorProps} />
      </mesh>

      <mesh position={[-distance, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={wallSize} />
        <MeshReflectorMaterial {...reflectorProps} />
      </mesh>

      <mesh position={[distance, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={wallSize} />
        <MeshReflectorMaterial {...reflectorProps} />
      </mesh>

      <mesh position={[0, 0, -distance]} rotation={[0, 0, 0]}>
        <planeGeometry args={wallSize} />
        <MeshReflectorMaterial {...reflectorProps} />
      </mesh>

      <mesh position={[0, 0, distance]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={wallSize} />
        <MeshReflectorMaterial {...reflectorProps} />
      </mesh>
    </group>
  )
}