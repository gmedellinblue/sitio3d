import { useVideoTexture } from '@react-three/drei'
import { useAppState } from '../../context/AppStateContext'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

export default function CubeContent() {
  const { mode } = useAppState()

  let videoSrc = null

  if (mode === 'intro') videoSrc = '/videos/intro.mp4'
  else if (mode === 'section-food') videoSrc = '/videos/food.mp4'
  else if (mode === 'section-water') videoSrc = '/videos/water.mp4'
  else if (mode === 'section-resources') videoSrc = '/videos/resources.mp4'

  if (!videoSrc) return null

  const texture = useVideoTexture(videoSrc, {
    unsuspend: 'canplay',
    crossOrigin: 'Anonymous',
    muted: false,
    loop: true,
    start: true,
    playsInline: true,
  })

  useEffect(() => {
    if(texture) {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.encoding = THREE.sRGBEncoding
    }
  }, [texture])

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, 0.05]}> 
        <planeGeometry args={[1.9, 1.05]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.05]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.9, 1.05]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  )
}
