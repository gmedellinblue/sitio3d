import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Hud, OrthographicCamera, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { useVideoTexture } from '@react-three/drei'

export const AutoScaledImage = ({ texture, position = [0, 0, 0], scale = 1, opacity = 1, rotation = [0, 0, 0], transparent = true }) => {
  const [aspect, setAspect] = useState(1)

  useEffect(() => {
    if (texture?.image) {
      setAspect(texture.image.width / texture.image.height)
    }
  }, [texture])

  return (
    <mesh 
      position={position} 
      rotation={rotation}
      renderOrder={10}
    >
      <planeGeometry args={[1 * aspect * scale, 1 * scale]} />
      <meshBasicMaterial
        map={texture}
        transparent={transparent}
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
        depthTest={true}
      />
    </mesh>
  )
}

export const StaticElement = ({ texture, position, scale = [1, 1, 1], opacity = 1, rotation = [0, 0, 0] }) => (
  <mesh position={position} rotation={rotation} renderOrder={10} >
    <planeGeometry args={[1, 1]} />
    <meshBasicMaterial
      map={texture}
      transparent
      opacity={opacity}
      toneMapped={false}
      depthWrite={false}
    />
  </mesh>
)

export const FloatingElement = ({ texture, position, scale = 1, speed = 2, amplitude = 0.1 }) => {
  const ref = useRef()
  const initialY = position[1]
  const [aspect, setAspect] = useState(1)

  useEffect(() => {
    if (texture?.image) setAspect(texture.image.width / texture.image.height)
  }, [texture])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed) * amplitude
  })

  return (
    <mesh ref={ref} position={position} renderOrder={10}>
      <planeGeometry args={[1 * aspect * scale, 1 * scale]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}

export const HudTextManager = ({ page, textures, customScales = [], slideDistance = 12 }) => {
  const textRefs = useRef([])
  const { size } = useThree()

  useEffect(() => {
    textures.forEach((_, index) => {
      const mesh = textRefs.current[index]
      if (!mesh) return

      if (index === page) {
        gsap.fromTo(mesh.position,
          { y: -slideDistance, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
        )
      } else if (index < page) {
        gsap.to(mesh.position, { y: slideDistance, opacity: 0, duration: 0.6 })
      } else {
        gsap.set(mesh.position, { y: -slideDistance, opacity: 0 })
      }
    })
  }, [page, textures, slideDistance])

  return (
    <Hud renderPriority={1}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
      
      <group position={[0, 0, 0]}>
        {textures.map((tex, index) => {
          const currentScale = customScales[index] || 12
          
          return (
            <group key={`grp-${index}`} ref={el => textRefs.current[index] = el}>
              <AutoScaledImage 
                texture={tex} 
                scale={currentScale} 
                position={[0, 0, 0]} 
              />
            </group>
          )
        })}
      </group>
    </Hud>
  )
}

export const VideoElement = ({ videoSrc, position, scale = [1, 1, 1], rotation = [0, 0, 0], opacity = 1 }) => {
  const texture = useVideoTexture(videoSrc, {
    start: true,
    loop: true,
    muted: true,
    playsInline: true
  })

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  )
}