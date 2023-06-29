const express = require('express')
const next = require('next')
const { createServer } = require('node:http')
const socketIO = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = parseInt(process.env.PORT || '3000', 10)

const scoresDB = { scores: [] }
const MAX_NUMBERS_SCORES = 10
const SOCKET_EVENTS = {
  UPDATE_TOP_SCORES: 'update-top-scores',
  LOAD_TOP_SCORES: 'load-top-scores',
  NEW_TOP_SCORE: 'new-top-score'
}

const checkBadFormatScore = (score) => {
  return !(Object.hasOwn(score, 'name') && Object.hasOwn(score, 'score'))
}

const modifyScores = (scores, newScore) => {
  const scoresCpy = scores.slice()

  scoresCpy.push(newScore)

  scoresCpy.sort((score1, score2) => score2.score - score1.score)

  if (scoresCpy.length >= MAX_NUMBERS_SCORES) scoresCpy.length = 10

  return scoresCpy
}

app.prepare().then(() => {
  const server = express()

  const httpServer = createServer(server)
  const io = socketIO(httpServer, {
    cors: {
      origin: 'https://aimlab-ashy.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  httpServer.listen(port, (err) => {
    if (err) throw err
    console.log('> Ready server')
  })

  io.on('connection', (socket) => {
    socket.emit(SOCKET_EVENTS.LOAD_TOP_SCORES, scoresDB.scores)

    socket.on(SOCKET_EVENTS.NEW_TOP_SCORE, async (score) => {
      const { scores } = scoresDB

      try {
        if (checkBadFormatScore(score)) {
          throw new Error('Formato inválido')
        }

        const newScores = modifyScores(scores, score)

        scoresDB.scores = newScores

        socket.emit(SOCKET_EVENTS.UPDATE_TOP_SCORES, newScores)
      } catch (error) {
        let msg = 'Ha ocurrido un error al actualizar la tabla de puntuaciones'

        if (error instanceof Error) msg = error.message

        socket.emit(SOCKET_EVENTS.UPDATE_TOP_SCORES, msg)
      }
    })
  })
})
