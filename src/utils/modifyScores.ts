import type { Score } from '../typings'

const MAX_NUMBERS_SCORES = 10

export function modifyScores(scores: Score[], newScore: Score) {
  const scoresCpy = scores.slice()

  scoresCpy.push(newScore)

  scoresCpy.sort((score1, score2) => score2.score - score1.score)

  if (scoresCpy.length >= MAX_NUMBERS_SCORES) scoresCpy.length = 10

  return scoresCpy
}
