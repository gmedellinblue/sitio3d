export default function CubeContent() {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}
