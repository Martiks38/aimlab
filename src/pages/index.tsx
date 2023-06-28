import { useEffect } from 'react'
import io from 'socket.io-client'

import { BoardGame } from '@/components/BoardGame'

const socket = io('http://localhost:3000')
export default function HomePage() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.io')
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io')
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <main className='flex flex-col items-center h-screen p-8'>
      <h1 className='mb-4 text-2xl text-center'>Aimlab</h1>
      <BoardGame socket={socket} />
    </main>
  )
}
