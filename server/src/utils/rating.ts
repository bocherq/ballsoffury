interface EloResult {
  player1rating: number;
  player2rating: number;
}

type KFactorRule = {
  minDiff: number;
  maxDiff: number;
  k: number;
};

const kFactorRules: KFactorRule[] = [
  { minDiff: 151, maxDiff: Infinity, k: 0 },   // больше 150 → 0
  { minDiff: 101, maxDiff: 150, k: 10 },       // 101–150 → 10
  { minDiff: 51,  maxDiff: 100, k: 20 },       // 51–100 → 20
  { minDiff: 1,   maxDiff: 50,  k: 30 },       // 1–50 → 30
  { minDiff: -99, maxDiff: -1,  k: 40 },       // -99–-1 → 40
  { minDiff: -Infinity, maxDiff: -100, k: 60 },// меньше -100 → 60
];

function getKFactor(r1: number, r2: number): number {
  const diff = r1 - r2;

  const rule = kFactorRules.find(
    (rule) => diff >= rule.minDiff && diff <= rule.maxDiff
  );

  return rule ? rule.k : 10; // 10 по умолчанию
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