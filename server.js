const express = require('express')
const next = require('next')
const { createServer } = require('http')
const socketIO = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  const httpServer = createServer(server)
  const io = socketIO(httpServer)

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  httpServer.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })
})
