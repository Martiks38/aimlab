export const enum GAME_STATES {
  INITIAL = 'initial',
  FINISHED = 'finished',
  PLAYING = 'playing'
}

export const enum SOCKET_EVENTS {
  UPDATE_TOP_SCORES = 'update-top-scores',
  LOAD_TOP_SCORES = 'load-top-scores',
  NEW_TOP_SCORE = 'new-top-score'
}

export const enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export const nameStorage = 'top-scores'
