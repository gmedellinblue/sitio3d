import { useTexture, MeshReflectorMaterial, useVideoTexture } from '@react-three/drei'
import { useAppState } from '../context/AppStateContext'
import { AutoScaledImage, FloatingElement, HudTextManager } from './FoodSceneElements'
import * as THREE from 'three'


const ReflectiveMaterial = () => (
  <MeshReflectorMaterial
    resolution={512}
    mixBlur={1}
    mixStrength={20}
    mirror={1}
    color="#ffffff"
    metalness={0.9}
    roughness={0.1}
    opacity={0.1}
  />
)

const ScenarioEnvironment = ({ bgTop, bgBottom }) => (
  <group>
    <mesh position={[0, 0, -.99]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={bgTop} transparent toneMapped={false} />
    </mesh>

    <mesh position={[0, -.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={bgBottom} transparent toneMapped={false} />
    </mesh>

    <mesh position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <ReflectiveMaterial />
    </mesh>

    <mesh position={[-0.95, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[2, 2]} />
      <ReflectiveMaterial />
    </mesh>

    <mesh position={[0.95, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[2, 2]} />
      <ReflectiveMaterial />
    </mesh>
  </group>
)

export default function Food() {
  const { currentPage, currentScenario } = useAppState()
  const isVisible = (index) => Math.abs(currentScenario - index) <= 0

  const props = useTexture({
    // Intro
    intro_text: '/textures/food/text/intro.png',

    // Vision
    vision_text_1: '/textures/food/text/vision1.png',
    vision_text_2: '/textures/food/text/vision2.png',

    vision_fondo_top: '/textures/food/assets/vision_bg_top.png',
    vision_fondo_bottom: '/textures/food/assets/vision_bg_bottom.png',
    drone: '/textures/food/assets/drone.png',
    maiz: '/textures/food/assets/maiz.png',

    // Escenario 1

    escenario1_text_1: '/textures/food/text/escenario1_1.png',
    escenario1_text_2: '/textures/food/text/escenario1_2.png',
    escenario1_text_3: '/textures/food/text/escenario1_3.png',

    escenario1_bg_top: '/textures/food/assets/escenario1_bg_top.png',
    escenario1_bg_bottom: '/textures/food/assets/escenario1_bg_bottom.png',
    tractor: '/textures/food/assets/tractor.png',
    casa_1: '/textures/food/assets/casa1.png',
    casa_2: '/textures/food/assets/casa2.png',
    casa_3: '/textures/food/assets/casa3.png',
    invernaderos: '/textures/food/assets/invernaderos.png',

    // Escenario 2
    escenario2_text_1: '/textures/food/text/escenario2_1.png',
    escenario2_text_2: '/textures/food/text/escenario2_2.png',
    escenario2_text_3: '/textures/food/text/escenario2_3.png',

    escenario2_bg_top: '/textures/food/assets/escenario2_bg_top.png',
    escenario2_bg_bottom: '/textures/food/assets/escenario2_bg_bottom.png',
    nube: '/textures/food/assets/nube.png',
    tienda: '/textures/food/assets/tienda.png',
    oficinas: '/textures/food/assets/oficinas.png',
    industria: '/textures/food/assets/industria.png',
    casa_3: '/textures/food/assets/casa3.png',

    // Escenario 3
    escenario3_text_1: '/textures/food/text/escenario3_1.png',
    escenario3_text_2: '/textures/food/text/escenario3_2.png',
    escenario3_text_3: '/textures/food/text/escenario3_3.png',
    escenario3_text_4: '/textures/food/text/escenario3_2.png',

    escenario3_bg_top: '/textures/food/assets/escenario3_bg_top.png',
    escenario3_bg_bottom: '/textures/food/assets/escenario3_bg_bottom.png',
    vaca: '/textures/food/assets/vaca.png',
    camion: '/textures/food/assets/camion.png',
    edificio: '/textures/food/assets/edificio.png',
    drone: '/textures/food/assets/drone.png',

    // Escenario 4
    escenario4_text_1: '/textures/food/text/escenario4_1.png',
    escenario4_text_2: '/textures/food/text/escenario4_2.png',
    escenario4_text_3: '/textures/food/text/escenario4_3.png',

    escenario4_bg_top: '/textures/food/assets/escenario4_bg_top.png',
    escenario4_bg_bottom: '/textures/food/assets/escenario4_bg_bottom.png',
    mesa: '/textures/food/assets/mesa.png',
    silla1: '/textures/food/assets/silla1.png',
    silla2: '/textures/food/assets/silla2.png',

    // Conclusión

    conclusion_text: '/textures/food/text/conclusion.png'


  })

  // VIDEO INTRO
  const introVideo = useVideoTexture('/videos/food/intro.mp4', { autoplay: true, loop: true, muted: true })

  const texts = {
    0: [props.intro_text],
    1: [props.vision_text_1, props.vision_text_2],
    2: [props.escenario1_text_1, props.escenario1_text_2, props.escenario1_text_3],
    3: [props.escenario2_text_1, props.escenario2_text_2, props.escenario2_text_3],
    4: [props.escenario3_text_1, props.escenario3_text_2, props.escenario3_text_3, props.escenario3_text_4],
    5: [props.escenario4_text_1, props.escenario4_text_2, props.escenario4_text_3],
    6: [props.conclusion_text],
    7: []
  }

  return (
    <group>
      <HudTextManager page={currentPage} textures={texts[currentScenario] || []} />

      <group visible={isVisible(0)} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.9, 1.05]} />
          <meshBasicMaterial map={introVideo} toneMapped={false} />
        </mesh>
      </group>

      <group visible={isVisible(1)} rotation={[-Math.PI / 2, 0, 0]}>
        <ScenarioEnvironment bgTop={props.vision_fondo_top} bgBottom={props.vision_fondo_bottom} />
        <AutoScaledImage texture={props.maiz} position={[.15, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.30, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.45, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.60, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.75, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.90, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.105, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />
        <AutoScaledImage texture={props.maiz} position={[.120, -1, -0.4]} scale={.6} rotation={[-.3, -Math.PI / 4.5, 0]} />

        <FloatingElement texture={props.drone} position={[0.5, -0.4, 0]} scale={0.2} speed={3} />
        <FloatingElement texture={props.drone} position={[-0.6, 0.2, .1]} scale={0.5} speed={3} />
        <FloatingElement texture={props.drone} position={[0.7, 0.4, -.5]} scale={0.3} speed={3} />
        <FloatingElement texture={props.drone} position={[-0.9, -0.6, -.4]} scale={0.1} speed={3} />
      </group>

      <group visible={isVisible(2)} rotation={[Math.PI, 0, 0]}>
        <ScenarioEnvironment bgTop={props.escenario1_bg_top} bgBottom={props.escenario1_bg_bottom} />
        <AutoScaledImage texture={props.casa_1} position={[.1, -0.9, -0.98]} scale={.15} />
        <AutoScaledImage texture={props.casa_2} position={[-.4, -0.9, -0.98]} scale={.15} />
        <AutoScaledImage texture={props.casa_3} position={[-.7, -0.85, -0.98]} scale={.25} />
        <AutoScaledImage texture={props.invernaderos} position={[.65, -0.9, -0.98]} scale={.15} />
        <AutoScaledImage texture={props.tractor} position={[-0.2, -0.78, -0.4]} scale={0.5} speed={1} amplitude={0.05} />
      </group>

      <group visible={isVisible(3)} rotation={[Math.PI / 2, 0, 0]}>
        <ScenarioEnvironment bgTop={props.escenario2_bg_top} bgBottom={props.escenario2_bg_bottom} />
        <AutoScaledImage texture={props.nube} position={[0, 0, 0]} scale={0.5} />
        <AutoScaledImage texture={props.tienda} position={[.4, -0.85, -0.1]} scale={.15} />
        <AutoScaledImage texture={props.industria} position={[.3, -0.8, 0.6]} scale={.20} />
        <AutoScaledImage texture={props.oficinas} position={[-.3  , -0.8, -0.1]} scale={.20} />
        <AutoScaledImage texture={props.casa_3} position={[-.4, -0.8, 0.6]} scale={.25} />
      </group>

      <group visible={isVisible(4)} rotation={[0, 0, 0]}>
        <ScenarioEnvironment bgTop={props.escenario3_bg_top} bgBottom={props.escenario3_bg_bottom} />
        <AutoScaledImage texture={props.vaca} position={[-0.2, -0.9, 0]} scale={0.06} />
        <AutoScaledImage texture={props.camion} position={[0.3, -0.9, 0]} scale={0.08} />
        <AutoScaledImage texture={props.edificio} position={[0.05, -0.9, 0.2]} scale={0.08} />
        <AutoScaledImage texture={props.edificio} position={[0.05, -0.9, -0.3]} scale={0.08} />
        <FloatingElement texture={props.drone} position={[0.5, -0.9, 0.3]} scale={0.1} />
      </group>

      <group visible={isVisible(5)} rotation={[-Math.PI / 2, 0, 0]}>
        <ScenarioEnvironment bgTop={props.escenario4_bg_top} bgBottom={props.escenario4_bg_bottom} />
        <AutoScaledImage texture={props.mesa} position={[0, -0.6, 0.8]} scale={1} rotation={[-Math.PI / 3, 0, 0]}/>
        <AutoScaledImage texture={props.silla1} position={[-0.5, -0.7, 0]} scale={.6} />
        <AutoScaledImage texture={props.silla1} position={[-0.55, -0.7, .3]} scale={.6} />
        <AutoScaledImage texture={props.silla1} position={[-0.6, -0.7, .6]} scale={.6} />
        <AutoScaledImage texture={props.silla2} position={[0.5, -0.7, 0]} scale={.6} />
        <AutoScaledImage texture={props.silla2} position={[0.55, -0.7, .3]} scale={.6} />
        <AutoScaledImage texture={props.silla2} position={[0.6, -0.7, .6]} scale={.6} />
      </group>

      <group visible={isVisible(6)} rotation={[Math.PI, 0, 0]}>

        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[2, 1.15]} />
          <meshBasicMaterial map={introVideo} toneMapped={false} />
        </mesh>
      </group>

      <group visible={isVisible(7)} rotation={[Math.PI / 2, 0, 0]}>
      </group>

    </group>
  )
}