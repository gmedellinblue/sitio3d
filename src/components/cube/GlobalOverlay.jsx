import { useTexture, Hud, OrthographicCamera } from '@react-three/drei'
import { useAppState } from '../../context/AppStateContext'
import { AutoScaledImage } from '../../scenes/FoodSceneElements'

export default function GlobalOverlay() {
  const { mode } = useAppState()

  const textures = useTexture({
    idle_title: '/textures/inicio/cubo.png',

    intro_overlay: '/textures/inicio/introduction.png',
    food_overlay: '/textures/inicio/food.png',
    water_overlay: '/textures/inicio/water.png',
    resources_overlay: '/textures/inicio/resources.png'
  })

  if (mode === 'idle') {
    return (
      <AutoScaledImage 
        texture={textures.idle_title} 
        position={[0, 0, 1.01]} 
        scale={1.8} 
      />
    )
  }

  let activeOverlay = null
  
  if (mode === 'intro') activeOverlay = textures.intro_overlay
  else if (mode === 'section-food') activeOverlay = textures.food_overlay
  else if (mode === 'section-water') activeOverlay = textures.water_overlay
  else if (mode === 'section-resources') activeOverlay = textures.resources_overlay

  if (!activeOverlay) return null

  return (
    <Hud renderPriority={1}>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={60} />
      <group position={[0, 0, 0]}>
        <AutoScaledImage 
          texture={activeOverlay} 
          scale={20} 
          position={[0, 0, 0]} 
        />
      </group>
    </Hud>
  )
}