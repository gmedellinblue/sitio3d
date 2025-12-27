import { useState } from 'react'
import { useAppState } from '../../context/AppStateContext'
import '../../styles/navigation.css'

export default function NavigationControls() {
  const {
    mode,
    setMode,
    getNextSection,
    getPrevSection,
    changeSection
  } = useAppState()

  const [menuOpen, setMenuOpen] = useState(false)

  const isInSection = mode.startsWith('section-')
  const isExploring = mode.startsWith('explore-')

  if (!isInSection && !isExploring) return null

  const currentSection = mode.replace('section-', '').replace('explore-', '')

  return (
    <>
      {menuOpen && (
        <div className="menu-overlay">
          <p>MENÚ</p>
          <button className='white' onClick={() => setMenuOpen(false)}>Cerrar</button>
        </div>
      )}

      {!isExploring && (
        <div className="top">
          <button onClick={() => setMenuOpen(true)}>Menú</button>
        </div>
      )}

      {!isExploring && (
        <div className="left">
          <button
            onClick={() => {
              const prev = getPrevSection(currentSection)
              changeSection(prev)
            }}
          >
            Anterior
          </button>
        </div>
      )}

      {!isExploring && (
        <div className="right">
          <button
            onClick={() => {
              const next = getNextSection(currentSection)
              changeSection(next)
            }}
          >
            Siguiente
          </button>
        </div>
      )}

      {!isExploring && (
        <div className="bottom">
          <button
            onClick={() => {
              setMode(`explore-${currentSection}`)
              console.log('Explorando sección:', currentSection)
            }}
          >
            Explorar más
          </button>
        </div>
      )}
      {isExploring && (
        <div className="top">
          <button
            onClick={() => {
              setMode(`section-${currentSection}`)
              console.log('Volviendo a sección:', currentSection)
            }}
          >
            Volver
          </button>
        </div>
      )}
    </>
  )
}
