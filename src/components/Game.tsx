import { useEffect, useId, useRef } from 'react'

import { setPosition } from '../utils/position'

type GameProps = {
  addPoint: () => void
}

export function Game({ addPoint }: GameProps) {
  const gameId = useId()
  const intervalMenuId = useRef<number | undefined>(undefined)

  const changePosition = (objective: HTMLElement) => {
    setPosition(objective)

    window.clearInterval(intervalMenuId.current)

    intervalMenuId.current = window.setInterval(() => setPosition(objective), 2000)

    addPoint()
  }

  useEffect(() => {
    const objective = document.getElementById(`${gameId}-target`)

    if (!objective) return

    const resizeBoardGame = () => {
      const container = document.getElementById(`${gameId}-board`)
      const { width } = window.getComputedStyle(objective)

      if (container) {
        const { style } = container

        style.marginRight = width
        style.marginBottom = width
        style.width = `calc(100% - ${width})`
      }
    }

    resizeBoardGame()

    intervalMenuId.current = window.setInterval(() => setPosition(objective), 2000)

    // Generates the initial position of the target
    setPosition(objective)

    window.addEventListener('resize', resizeBoardGame)

    return () => {
      window.clearInterval(intervalMenuId.current)
      window.removeEventListener('resize', resizeBoardGame)
    }
  }, [])

  return (
    <div className='relative h-full max-w-[1200px] min-h-[360px] grow' id={`${gameId}-board`}>
      <div
        className='objective'
        onClick={(ev: React.MouseEvent<HTMLDivElement>) => changePosition(ev.currentTarget)}
        id={`${gameId}-target`}
      ></div>
    </div>
  )
}
