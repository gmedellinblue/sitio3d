import { createContext, useContext, useState, useRef } from 'react'

const AppStateContext = createContext()

export function AppStateProvider({ children }) {
  const [mode, setMode] = useState('idle')

  const SECTIONS = ['food', 'water', 'resources']

  function getNextSection(current) {
    const index = SECTIONS.indexOf(current)
    return SECTIONS[(index + 1) % SECTIONS.length]
  }

  function getPrevSection(current) {
    const index = SECTIONS.indexOf(current)
    return SECTIONS[(index - 1 + SECTIONS.length) % SECTIONS.length]
  }

  const [currentSection, setCurrentSection] = useState(null)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const changeSectionRef = useRef(null)


  return (
    <AppStateContext.Provider
      value={{
        mode,
        setMode,
        currentSection,
        setCurrentSection,
        currentScenario,
        setCurrentScenario,
        currentPage,
        setCurrentPage,
        getNextSection,
        getPrevSection,
        registerChangeSection: (fn) => changeSectionRef.current = fn,
        changeSection: (section) => changeSectionRef.current?.(section)
      }}
    >

      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  return useContext(AppStateContext)
}
