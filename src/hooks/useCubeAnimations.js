import { useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'

export function useCubeAnimations(cubeRef, sphereRef, setMode, setCurrentScenario, setShowReflectiveFrame) {
  const mainTimeline = useRef(null)
  const isTransitioning = useRef(false)

  const normalizeRotation = () => {
    if (!cubeRef.current) return
    cubeRef.current.rotation.x = cubeRef.current.rotation.x % (Math.PI * 2)
    cubeRef.current.rotation.y = cubeRef.current.rotation.y % (Math.PI * 2)
    cubeRef.current.rotation.z = cubeRef.current.rotation.z % (Math.PI * 2)
  }

  const playIntroAnimation = (getRandomSection) => {
    if (!cubeRef.current) return
    if (mainTimeline.current) mainTimeline.current.kill()

    mainTimeline.current = gsap.timeline({
      onComplete: () => {
        const nextSection = getRandomSection()
        setMode(`section-${nextSection}`)
        console.log('Intro terminada. Entrando a:', nextSection)
      }
    })

    mainTimeline.current
      .add('start')
      .to(cubeRef.current.position, { z: 4.9, duration: 1.5, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.rotation, { x: 0, y: -Math.PI, z: 0, duration: 1.5, ease: 'power2.inOut' }, 'start')
      .to(sphereRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: 'power2.in' }, 'start')
      .to({}, { duration: 5 })
      .call(() => {
        console.log("Cambiando a Cubo Normal")
        setShowReflectiveFrame(false)
      })
      .to({}, { duration: 5 })
  }

  const playGrandEntrance = (onCompleteCallback) => {
    if (!cubeRef.current) return
    if (mainTimeline.current) mainTimeline.current.kill()
    normalizeRotation()

    mainTimeline.current = gsap.timeline({
      onStart: () => console.log('4 Vueltas'),
      onComplete: onCompleteCallback
    })

    const timeOut = 3
    const timeIn = 1
    const randomTilt1 = (Math.random() - 0.3) * 0.5
    const randomTilt2 = (Math.random() - 0.3) * 0.5

    mainTimeline.current
      .add('start')
      .to(cubeRef.current.position, { z: 1.8, duration: timeOut, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.position, { z: 4.9, duration: timeIn, ease: 'power2.inOut' }, `start+=${timeOut}`)
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

  const playSectionTransition = (nextSectionName) => {
    if (!cubeRef.current) return
    normalizeRotation()
    isTransitioning.current = true
    if (mainTimeline.current) mainTimeline.current.kill()

    mainTimeline.current = gsap.timeline({
      onComplete: () => {
        isTransitioning.current = false
        if (nextSectionName) setMode(`section-${nextSectionName}`)
      }
    })

    const timeOut = .9
    const timeIn = .9
    const totalTime = 1.8
    const randomTilt = (Math.random() - 0.5) * 0.3

    mainTimeline.current
      .add('start')
      .to(cubeRef.current.position, { z: 2.5, duration: timeOut, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.position, { z: 4.9, duration: timeIn, ease: 'power2.inOut' }, `start+=${timeOut}`)
      .to(cubeRef.current.rotation, { y: "-=" + Math.PI, duration: totalTime, ease: 'power2.inOut' }, 'start')
      .to(cubeRef.current.rotation, {
        keyframes: [{ x: randomTilt, duration: totalTime * 0.5 }, { x: 0, duration: totalTime * 0.5 }],
        ease: 'power1.inOut'
      }, 'start')
  }

  const playVerticalFlip = (callback) => {
    if (!cubeRef.current) return
    isTransitioning.current = true
    if (mainTimeline.current) mainTimeline.current.kill()

    normalizeRotation()

    mainTimeline.current = gsap.timeline({
      onComplete: () => {
        isTransitioning.current = false
        if (callback) callback()
      }
    })

    mainTimeline.current
      .to(cubeRef.current.position, { z: 2, duration: 0.5, ease: 'power2.out' })
      .to(cubeRef.current.rotation, { 
        x: 0, 
        y: 0, 
        z: 0, 
        duration: 1.2, ease: 'power2.inOut' 
      }, '<')
      .to(cubeRef.current.position, { z: 4.9, duration: 0.8, ease: 'power2.inOut' }, '-=0.5')
  }

  const animateScenarioChange = (targetScenario) => {
    if (!cubeRef.current) return
    isTransitioning.current = true

    const targetRotationX = targetScenario * (Math.PI / 2)

    gsap.to(cubeRef.current.rotation, {
      x: targetRotationX,
      y: 0, 
      z: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      onComplete: () => {
        isTransitioning.current = false
        console.log(`Llegada a Escenario ${targetScenario}`)
      }
    })
    
    gsap.to(cubeRef.current.position, { z: 4.9, duration: 1.5, ease: 'power2.inOut' })
  }

  const animateScrollZoom = (page, currentScenario) => {
    if (!cubeRef.current || isTransitioning.current) return

    const zoomConfigs = {
      0: [{ z: 4.9, rotY: 0 }],

      1: [{  z: 4, x: 0, y: 0, rotY: 0}, { z: 4.2, x: 0, y: 0.2, rotY: 0}],

      2: [{ z: 4, rotY: 0 }, { z: 3.5, rotY: 0.1 }, { z: 3, rotY: -0.1 }, { z: 2.5, rotY: 0 }],

      3: [{ z: 4, rotY: 0 }, { z: 3.2, rotY: 0.1 }, { z: 3, rotY: -0.1 }],

      4: [{ z: 4, rotY: 0 }, { z: 3.5, rotY: 0.1 }, { z: 3, rotY: -0.1 }],

      5: [{ z: 4, rotY: 0 }, { z: 3.5, rotY: 0.05 }, { z: 3, rotY: -0.05 }, { z: 2.5, rotY: 0 }],

      6: [{ z: 0.1, rotY: 0 }],

      7: [{ z: 5, rotY: 0 }]
    }

    const defaultConfig = { z: 4, x: 0, y: 0, rotY: 0 }
    const config = zoomConfigs[currentScenario]?.[page] || defaultConfig
    
    const targetZ = config.z !== undefined ? config.z : 4
    const targetX = config.x !== undefined ? config.x : 0
    const targetY = config.y !== undefined ? config.y : 0
    const targetRotY = config.rotY !== undefined ? config.rotY : 0

    const currentBaseX = currentScenario * (Math.PI / 2)

    gsap.to(cubeRef.current.position, { 
        x: targetX,
        y: targetY,
        z: targetZ, 
        duration: 1.2, 
        ease: 'power2.inOut' 
    })

    gsap.to(cubeRef.current.rotation, { 
        x: currentBaseX, 
        y: targetRotY, 
        z: 0, 
        duration: 1.2, 
        ease: 'power2.inOut' 
    })
  }

  return {
    playIntroAnimation,
    playGrandEntrance,
    playSectionTransition,
    playVerticalFlip,
    animateScenarioChange,
    animateScrollZoom,
    mainTimeline,
    isTransitioning
  }
}