import { useEffect, useRef } from 'react'
import io from 'socket.io-client'

import { BoardGame } from '@/components/BoardGame'

import { SOCKET_EVENTS, nameStorage } from '../consts'

import type { Scores, Score } from '../typings'

const socket = io()

export default function HomePage() {
  const firstRender = useRef(true)

  useEffect(() => {
    socket.on(SOCKET_EVENTS.LOAD_TOP_SCORES, (data: Scores) => {
      console.log(data)
      window.sessionStorage.setItem(nameStorage, JSON.stringify(data))
    })

    socket.on(SOCKET_EVENTS.UPDATE_TOP_SCORES, (scores: Score[] | string) => {
      if (typeof scores !== 'string') {
        window.sessionStorage.setItem(nameStorage, JSON.stringify(scores))
      }
    })

    if (firstRender.current) firstRender.current = false

    return () => {
      if (!firstRender.current) socket.disconnect()
    }
  }, [])

  return (
    <main className='flex flex-col items-center h-screen p-8'>
      <h1 className='mb-4 text-2xl text-center'>Aimlab</h1>
      <BoardGame socket={socket} />
    </main>
  )
}
