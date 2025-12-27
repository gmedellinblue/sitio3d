import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import InteractiveCube from './components/cube/InteractiveCube'
import NavigationControls from './components/ui/NavigationControls'
import '../src/index.css'

function App() {
  return (
    <div>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true,toneMappingExposure: 1.2}}>
        <ambientLight intensity={3} />
        <directionalLight position={[5, -5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <InteractiveCube />
        </Suspense>
      </Canvas>
      <NavigationControls />
    </div>

  )
}

export default App
