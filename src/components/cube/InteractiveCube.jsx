import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { useAppState } from '../../context/AppStateContext'

export default function InteractiveCube() {
  const { scene: cubeScene } = useGLTF('/models/cube.glb')
  const { scene: sphereScene } = useGLTF('/models/sphere.glb')
  const { mode, setMode, currentPage, setCurrentPage, registerChangeSection } = useAppState()

  const cubeRef = useRef()
  const sphereRef = useRef()

  const mainTimeline = useRef(null)
  const isFirstSectionEntry = useRef(true)
  const isTransitioning = useRef(false)
  const scrollTimeout = useRef(false)
  const previousMode = useRef(mode)

  const [isHovered, setIsHovered] = useState(false)
  const targetRotation = useRef(new THREE.Vector2(0, 0))

  const SECTIONS = ['food', 'water', 'resources']
  const SPHERE_ROTATION_SPEED = 3

  
  function getRandomSection() {
    const index = Math.floor(Math.random() * SECTIONS.length)
    return SECTIONS[index]
  }

  function getNextSection(current) {
    const currentIndex = SECTIONS.indexOf(current)
    return SECTIONS[(currentIndex + 1) % SECTIONS.length]
  }

  const playIntroAnimation = () => {
    if (!cubeRef.current) return
    
    if (mainTimeline.current) mainTimeline.current.kill()

    isFirstSectionEntry.current = true 

    mainTimeline.current = gsap.timeline({
      onComplete: () => {
        const nextSection = getRandomSection()
        setMode(`section-${nextSection}`)
        console.log('Intro terminada. Entrando a:', nextSection)
      }
    })

    mainTimeline.current
      .add('start')
      .to(cubeRef.current.position, { z: 4, duration: 1.5, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.rotation, { x: 0, y: -Math.PI, z: 0, duration: 1.5, ease: 'power2.inOut' }, 'start')
      .to(sphereRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: 'power2.in' }, 'start')
      .to({}, { duration: 1 })
  }

  const playGrandEntrance = () => {
    if (!cubeRef.current) return
    if (mainTimeline.current) mainTimeline.current.kill()

    mainTimeline.current = gsap.timeline({
      onStart: () => console.log('Cambio de sección (4 vueltas)'),
      onComplete: () => { isFirstSectionEntry.current = false }
    })

    const timeOut = 4.5
    const timeIn = 3
    const randomTilt1 = (Math.random() - 0.3) * 1
    const randomTilt2 = (Math.random() - 0.3) * 1

    mainTimeline.current
      .add('start')
      .to(cubeRef.current.position, { z: -1, duration: timeOut, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.position, { z: 4, duration: timeIn, ease: 'power2.inOut' }, `start+=${timeOut}`)
      .to(cubeRef.current.rotation, { y: "-=" + Math.PI * 8, duration: timeOut + timeIn, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.rotation, {
        keyframes: [
          { x: randomTilt1, duration: (timeOut + timeIn) * 0.33 },
          { x: randomTilt2, duration: (timeOut + timeIn) * 0.33 },
          { x: 0, duration: (timeOut + timeIn) * 0.34 }
        ],
        ease: 'power1.inOut',
      }, 'start')
  }
  const playSectionTransition = (nextSectionName = null) => {
    if (!cubeRef.current) return
    isTransitioning.current = true
    if (mainTimeline.current) mainTimeline.current.kill()

    mainTimeline.current = gsap.timeline({
      onStart: () => console.log('Cambio de sección (Media vuelta)'),
      onComplete: () => {
        isTransitioning.current = false
        if (nextSectionName) {
           setMode(`section-${nextSectionName}`)
           console.log('Cambio de escenario a:', nextSectionName)
        }
      }
    })

    const timeOut = 1.5
    const timeIn = 1.5
    const totalTime = 3
    const randomTilt = (Math.random() - 0.5) * 0.5 

    mainTimeline.current
      .add('start')
      .to(cubeRef.current.position, { z: -1, duration: timeOut, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.position, { z: 4, duration: timeIn, ease: 'power2.inOut' }, `start+=${timeOut}`)
      .to(cubeRef.current.rotation, { y: "-=" + Math.PI, duration: totalTime, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.rotation, {
        keyframes: [
           { x: randomTilt, duration: totalTime * 0.5 },
           { x: 0, duration: totalTime * 0.5 }
        ],
        ease: 'power1.inOut'
      }, 'start')
  }

  const animateScrollZoom = (page) => {
    if (!cubeRef.current) return
    
    const zoomVariants = [
      { z: 1.5, rot: [0.2, -0.3, 0] },
      { z: 2.2, rot: [-0.1, 0.25, 0] },
      { z: 1.8, rot: [0.15, 0.1, 0] }
    ]
    const variant = zoomVariants[page % zoomVariants.length]

    gsap.to(cubeRef.current.position, { z: variant.z, duration: 1, ease: 'power2.inOut' })
    gsap.to(cubeRef.current.rotation, { 
      x: variant.rot[0], 
      y: variant.rot[1], 
      z: variant.rot[2], 
      duration: 1, 
      ease: 'power2.inOut' 
    })

    if (page !== 0 && page % 3 === 0) {
      gsap.to(cubeRef.current.rotation, { 
        x: "+=" + Math.PI / 2, 
        duration: 1.2, 
        ease: 'power2.inOut' 
      })
    }
  }

  useEffect(() => {
    registerChangeSection((targetSection) => {
        playSectionTransition(targetSection)
    })
  }, [])

  useEffect(() => {
    if (mode === 'intro') {
      playIntroAnimation()
    } 
    
    else if (mode.startsWith('section-')) {
      
      if (previousMode.current.startsWith('explore-')) {
         console.log('🔙 Volviendo del modo exploración...')
         playSectionTransition()
      }

      else if (isFirstSectionEntry.current) {
         playGrandEntrance()
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
      previousMode.current = mode
    }

  }, [mode])

  useEffect(() => {
    if (!mode.startsWith('explore-')) return

    const onWheel = (e) => {
      if (scrollTimeout.current) return
      scrollTimeout.current = true

      setCurrentPage(prev => {
        const next = e.deltaY > 0 ? prev + 1 : Math.max(prev - 1, 0)
        return next
      })
      setTimeout(() => { scrollTimeout.current = false }, 1200)
    }
    window.addEventListener('wheel', onWheel)
    return () => window.removeEventListener('wheel', onWheel)
  }, [mode])

  useEffect(() => {
    if (mode.startsWith('explore-')) {
      animateScrollZoom(currentPage)
    }
  }, [currentPage, mode])

  useFrame((state, delta) => {
    if (mode !== 'idle' || !cubeRef.current) return

    const time = state.clock.elapsedTime
    
    if (!isHovered) {
      targetRotation.current.x = Math.sin(time * 0.5) * 0.05
      targetRotation.current.y = Math.sin(time * 0.3) * 0.05
    } else {
      targetRotation.current.x = -state.mouse.y * 1.5
      targetRotation.current.y = state.mouse.x * 1.5
    }

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
      onPointerOver={() => { if (mode !== 'intro') setIsHovered(true) }}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => {
        if (mode === 'idle') {
          setMode('intro')
          console.log('Modo introducción')
        }
      }}
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