interface EloResult {
  player1rating: number;
  player2rating: number;
}

function getKFactor(r1: number, r2: number) {
    return r1 - r2 > 150 ? 0 : r1 - r2 > 100 ? 10 : r1 - r2 > 50 ? 20 : r1 - r2 > 0 ? 30 : r1 - r2 < 0 ? 40 : r1 - r2 < -100 ? 60 : 0;
}

export function calculateEloRating(rating1: number, rating2: number, result: 0 | 1): EloResult {
  const expected1 = 1 / (1 + Math.pow(10, (rating2 - rating1) / 40));
  const expected2 = 1 / (1 + Math.pow(10, (rating1 - rating2) / 40));

  const K1 = getKFactor(rating1, rating2);
  const K2 = getKFactor(rating2, rating1);

  const actual1 = result;
  const actual2 = 1 - result;

  const player1rating = Math.round(rating1 + K1 * (actual1 - expected1));
  const player2rating = Math.round(rating2 + K2 * (actual2 - expected2));

  return { player1rating, player2rating };
}