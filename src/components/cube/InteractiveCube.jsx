import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useAppState } from '../../context/AppStateContext'
import GlobalOverlay from './GlobalOverlay'

import CubeContent from './CubeContent'
import InnerReflectiveWalls from './InnerReflectiveWalls'
import Food from '../../scenes/Food'

import { useCubeAnimations } from '../../hooks/useCubeAnimations'
import { useCubeScroll } from '../../hooks/useCubeScroll'

export default function InteractiveCube() {
  const { scene: cubeScene } = useGLTF('/models/cube.glb')
  const { scene: frameScene } = useGLTF('/models/cube_frame.glb')
  const { scene: sphereScene } = useGLTF('/models/sphere.glb')

  const { mode, setMode, currentPage, setCurrentPage, currentScenario, setCurrentScenario, registerChangeSection } = useAppState()

  const cubeRef = useRef()
  const sphereRef = useRef()

  const isFirstSectionEntry = useRef(true)
  const previousMode = useRef(mode)
  const [isHovered, setIsHovered] = useState(false)
  const targetRotation = useRef(new THREE.Vector2(0, 0))

  const SECTIONS = ['food', 'water', 'resources']
  const SPHERE_ROTATION_SPEED = 3

  const [showReflectiveFrame, setShowReflectiveFrame] = useState(true)

  const {
    playIntroAnimation,
    playGrandEntrance,
    playSectionTransition,
    playVerticalFlip,
    animateScenarioChange,
    animateScrollZoom,
    isTransitioning
  } = useCubeAnimations(cubeRef, sphereRef, setMode, setCurrentScenario, setShowReflectiveFrame)

  useCubeScroll(mode, currentPage, setCurrentPage, currentScenario, setCurrentScenario, isTransitioning)

  function getRandomSection() {
    return SECTIONS[Math.floor(Math.random() * SECTIONS.length)]
  }
  function getNextSection(current) {
    const currentIndex = SECTIONS.indexOf(current)
    return SECTIONS[(currentIndex + 1) % SECTIONS.length]
  }

  useEffect(() => {
    registerChangeSection((targetSection) => playSectionTransition(targetSection))
  }, [])

  useEffect(() => {
    if (mode.startsWith('explore-')) {
      animateScenarioChange(currentScenario)
    }
  }, [currentScenario])

  useEffect(() => {
    if (mode.startsWith('explore-')) {
      animateScrollZoom(currentPage, currentScenario)
    }
  }, [currentPage])

  useEffect(() => {
    if (mode === 'intro') {
      playIntroAnimation(getRandomSection)
    }
    else if (mode.startsWith('section-')) {
      if (previousMode.current.startsWith('explore-')) {
        setCurrentScenario(0)
        playVerticalFlip()
      }
      else if (isFirstSectionEntry.current) {
        setShowReflectiveFrame(false)
        playGrandEntrance(() => { isFirstSectionEntry.current = false })
      }

      const currentSectionName = mode.replace('section-', '')
      const timer = setTimeout(() => {
        const next = getNextSection(currentSectionName)
        playSectionTransition(next)
      }, 15000)

      previousMode.current = mode
      return () => clearTimeout(timer)
    }
    else if (mode.startsWith('explore-')) {
      if (previousMode.current.startsWith('section-')) playVerticalFlip()
      previousMode.current = mode
    }
  }, [mode])

  useEffect(() => {
    if (cubeScene) {
      cubeScene.traverse((child) => {
        if (child.isMesh) {

          child.material.depthWrite = false

          child.material.side = THREE.DoubleSide
        }
      })
    }
  }, [cubeScene])

  useFrame((state, delta) => {
    if (!cubeRef.current || mode !== 'idle') return
    const time = state.clock.elapsedTime
    targetRotation.current.x = isHovered ? -state.mouse.y * 1.5 : Math.sin(time * 0.5) * 0.05
    targetRotation.current.y = isHovered ? state.mouse.x * 1.5 : Math.sin(time * 0.3) * 0.05
    cubeRef.current.rotation.x = THREE.MathUtils.lerp(cubeRef.current.rotation.x, targetRotation.current.x, 0.1)
    cubeRef.current.rotation.y = THREE.MathUtils.lerp(cubeRef.current.rotation.y, targetRotation.current.y, 0.1)
    cubeRef.current.position.y = Math.sin(time) * 0.1
    if (sphereRef.current) {
      sphereRef.current.rotation.x = Math.sin(time) * 0.25
      if (isHovered) sphereRef.current.rotation.y += delta * SPHERE_ROTATION_SPEED
    }
  })

  return (
    <group
      ref={cubeRef}
      onPointerOver={() => { if (mode === 'idle') setIsHovered(true) }}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => { if (mode === 'idle') setMode('intro') }}
    >

      {showReflectiveFrame ? (
        <primitive object={frameScene} />
      ) : (
        <primitive object={cubeScene} />
      )}
      {showReflectiveFrame && <InnerReflectiveWalls />}

      <CubeContent />

      <GlobalOverlay />

      {mode === 'explore-food' && <Food />}

      <primitive ref={sphereRef} object={sphereScene} scale={0.5} position={[0, 0, 0]} />
    </group>
  )
}