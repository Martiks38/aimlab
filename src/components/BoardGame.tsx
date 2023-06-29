import { useCallback, useEffect, useRef, useState } from 'react'

import { Game } from './Game'
import { NicknameModal } from './NicknameModal'

import confetti from 'canvas-confetti'
import { modifyScores } from '../utils/modifyScores'

import { GAME_STATES, SOCKET_EVENTS, nameStorage } from '../consts'

import type { Score } from '../typings'
import type { Socket } from 'socket.io-client'

interface BoardGameProps {
  socket: Socket | null
}

// Game time
// thirty seconds
const timeLeftInit = 15 * 1000

export function BoardGame({ socket }: BoardGameProps) {
  const [state, setState] = useState<'initial' | 'playing' | 'finished'>('initial')
  const [viewNickModal, setViewNickModal] = useState(false)
  const [score, setScore] = useState(0)
  const [scores, setScores] = useState<Score[]>([])
  const [timeLeft, setTimeLeft] = useState(timeLeftInit)
  const intervalIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (state === GAME_STATES.PLAYING) {
      intervalIdRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 100)
      }, 100)
    }

    const scoresStr = window.sessionStorage.getItem(nameStorage)

    setScores(scoresStr ? JSON.parse(scoresStr) : [])
  }, [state])

  useEffect(() => {
    if (timeLeft === 0 && state === GAME_STATES.PLAYING) {
      setState(GAME_STATES.FINISHED)

      /* Check new score */
      const isNewBestScore =
        (scores.length >= 0 && scores.length < 10) ||
        scores.some((topScore) => topScore.score < score)

      if (isNewBestScore) {
        const canvas = document.getElementById('confetti')

        if (canvas instanceof HTMLCanvasElement) canvas.style.zIndex = '10'

        confetti({ particleCount: 100, spread: 160 })

        setViewNickModal(true)
      }

      clearInterval(intervalIdRef.current)
    }
  }, [score, scores, state, timeLeft])

  function initGame() {
    setState(GAME_STATES.PLAYING)
    setScore(0)
  }

  const resetGame = useCallback(() => {
    const canvas = document.getElementById('confetti')

    if (canvas instanceof HTMLCanvasElement) canvas.style.zIndex = '-10'

    confetti.reset()

    setState(GAME_STATES.PLAYING)
    setTimeLeft(timeLeftInit)
    setScore(0)
  }, [])

  const addPoint = () => setScore((prevScore) => prevScore + 1)

  const submitScore = useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      const regexName = /[a-zñ0-9]{3,8}/i
      const form = ev.currentTarget
      const errorMessage = form.querySelector('#errorMessage')

      let input: HTMLInputElement | null = null
      let nicknameValue = ''

      ev.preventDefault()

      if (form.nickname instanceof HTMLInputElement) {
        input = form.nickname
        nicknameValue = input.value
      }

      setViewNickModal(false)

      if (regexName.test(nicknameValue) && socket) {
        const newBestScore = { name: nicknameValue, score }
        const scoresStr = window.sessionStorage.getItem(nameStorage)
        const currentScores: Score[] = scoresStr ? JSON.parse(scoresStr) : []

        socket.emit(SOCKET_EVENTS.NEW_TOP_SCORE, newBestScore)

        errorMessage?.classList.add('hidden')
        setScores(modifyScores(currentScores, newBestScore))
      } else {
        errorMessage?.classList.toggle('hidden')
      }
    },
    [score, socket]
  )

  return (
    <>
      <canvas id='confetti' className='fixed top-0 left-0 -z-10' width={300} height={200}></canvas>
      {state === GAME_STATES.FINISHED && !viewNickModal && (
        <div className='flex flex-col items-center w-full max-w-[17.5rem]'>
          <h3 className='mb-4 text-xl'>{`Puntuación: ${score}`}</h3>
          <ol className='w-full'>
            {scores &&
              scores.map((score, index) => (
                <li key={index} className='flex justify-between w-full mb-2'>
                  <span>{score.name}</span>
                  <span>{score.score}</span>
                </li>
              ))}
          </ol>
          <button
            onClick={resetGame}
            className='mt-8 mx-auto px-4 py-1.5 w-fit bg-stone-950 rounded-lg text-xl'
          >
            Volver a jugar
          </button>
        </div>
      )}
      {state === GAME_STATES.INITIAL && (
        <>
          <button className='mb-4 px-4 py-1.5 bg-stone-950 rounded-lg text-xl' onClick={initGame}>
            Jugar
          </button>
          {state === GAME_STATES.INITIAL && <h2 className='mb-4'>Puntos: {score}</h2>}
          <Game addPoint={addPoint} />
        </>
      )}
      {state === GAME_STATES.PLAYING && (
        <>
          <h2 className='mb-4 text-xl'>
            {(timeLeft / 1000).toFixed(1).toString().padStart(4, '0')}
          </h2>
          <Game addPoint={addPoint} />
        </>
      )}

      {viewNickModal && <NicknameModal submitScore={submitScore} />}
    </>
  )
}
