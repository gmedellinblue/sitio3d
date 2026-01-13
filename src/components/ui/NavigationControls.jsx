import { useState } from 'react'
import { useAppState } from '../../context/AppStateContext'
import '../../styles/navigation.css'
import logo from '../../assets/intro/Logo.svg'
import menu from '../../assets/intro/menu.svg'
import anterior from '../../assets/intro/anterior.svg'
import siguiente from '../../assets/intro/siguiente.svg'
import pie from '../../assets/intro/Kubotasvision.svg'

export default function NavigationControls() {
  const {
    mode,
    setMode,
    getNextSection,
    getPrevSection,
    changeSection,
    setCurrentPage
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
          <button onClick={() => window.location.reload()}>
            <img src={logo} alt="KUBOTA FUTURE CUBE" />
          </button>
        </div>
      )}

      {!isExploring && (
        <div className="menu hover">
          <button onClick={() => setMenuOpen(true)}><img src={menu} alt="MENU" /></button>
        </div>
      )}

      {!isExploring && (
        <div className="left hover">
          <button
            onClick={() => {
              const prev = getPrevSection(currentSection)
              changeSection(prev)
            }}
          >
            <img src={anterior} alt="Anterior" />
          </button>
        </div>
      )}

      {!isExploring && (
        <div className="right hover">
          <button
            onClick={() => {
              const next = getNextSection(currentSection)
              changeSection(next)
            }}
          >
            <img src={siguiente} alt="Siguiente" />
          </button>
        </div>
      )}

      {!isExploring && (
        <div className="pie">
          <button >
            <img src={pie} alt="Kubotasvision" />
          </button>
        </div>
      )}

      {!isExploring && (
        <div className="explore hover">
          <button
            onClick={() => {
              setCurrentPage(0)
              setMode(`explore-${currentSection}`)
              console.log('Explorando sección:', currentSection)
            }}
          >
            Explorar más
          </button>
        </div>
      )}

      {isExploring && (
        <div className="top-right">
          <button
            onClick={() => {
              setCurrentPage(0)
              setMode(`section-${currentSection}`)
              console.log('Volviendo a sección:', currentSection)
            }}
          ><img src={menu} alt="MENU" />
          </button>
        </div>
      )}
    </>
  )
}