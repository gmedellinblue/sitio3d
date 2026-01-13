import { useEffect, useRef } from 'react'

export function useCubeScroll(
  mode, 
  currentPage, 
  setCurrentPage, 
  currentScenario, 
  setCurrentScenario, 
  isTransitioning
) {
  const scrollTimeout = useRef(false)

  const maxPagesPerScenario = {
    0: 0,
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 2,
    6: 0,
    7: 0
  }

  useEffect(() => {
    if (!mode.startsWith('explore-')) return

    const onWheel = (e) => {
      if (scrollTimeout.current || isTransitioning.current) return
      scrollTimeout.current = true

      const direction = e.deltaY > 0 ? 1 : -1
      const maxPage = maxPagesPerScenario[currentScenario] || 0

      if (direction > 0) {
        if (currentPage < maxPage) {
           setCurrentPage(prev => prev + 1)
        } else {
           if (currentScenario < 7) {
              setCurrentScenario(prev => prev + 1)
              setCurrentPage(0)
           }
        }
      } else {
        if (currentPage > 0) {
           setCurrentPage(prev => prev - 1)
        } else {
           if (currentScenario > 0) {
              setCurrentScenario(prev => prev - 1)
              const prevMax = maxPagesPerScenario[currentScenario - 1] || 0
              setCurrentPage(prevMax)
           }
        }
      }

      setTimeout(() => { scrollTimeout.current = false }, 1200)
    }

    window.addEventListener('wheel', onWheel)
    return () => window.removeEventListener('wheel', onWheel)
  }, [mode, currentPage, currentScenario, isTransitioning])
}