export type Rarity = "white" | "blue" | "orange" | "purple";

// 素材としての価値（内部pt）
export const POINTS: Record<Rarity, number> = {
  white: 1,
  blue: 2,
  orange: 3,
  purple: 10,
};

// 作成コスト（内部pt）
export const COST_PT: Record<Rarity, number> = {
  white: 5,
  blue: 4,
  orange: 6,
  purple: 20,
};

export type Input = Record<Rarity, number>;
export type Materials = Record<Rarity, number>;

// 必要pt
export function calculateRequiredPt(input: Input): number {
  return (Object.keys(input) as Rarity[]).reduce((sum, r) => {
    return sum + input[r] * COST_PT[r];
  }, 0);
}

// 現在pt
export function calculateCurrentPt(materials: Materials): number {
  return (Object.keys(materials) as Rarity[]).reduce((sum, r) => {
    return sum + materials[r] * POINTS[r];
  }, 0);
}

// テイラーストーン
export function calculateStones(input: Input): Record<Rarity, number> {
  const result: Record<Rarity, number> = {
    white: 0,
    blue: 0,
    orange: 0,
    purple: 0,
  };

  (Object.keys(input) as Rarity[]).forEach((r) => {
    result[r] = input[r] * 3;
  });

  return result;
}