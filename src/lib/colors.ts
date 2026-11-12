/** 카드 색상 팔레트: 모든 카드에 보라·라벤더 계열의 통일된 밤하늘 오라 적용 */
export const CARD_COLORS: Record<string, [string, string, string]> = {
  gold: ["#e9d5ff", "#7c4dff", "#c084fc"],
  red: ["#e9d5ff", "#7c4dff", "#c084fc"],
  yellow: ["#e9d5ff", "#7c4dff", "#c084fc"],
  purple: ["#e9d5ff", "#7c4dff", "#c084fc"],
  orange: ["#e9d5ff", "#7c4dff", "#c084fc"],
  blue: ["#e9d5ff", "#7c4dff", "#c084fc"],
  mint: ["#e9d5ff", "#7c4dff", "#c084fc"],
  pink: ["#e9d5ff", "#7c4dff", "#c084fc"],
  green: ["#e9d5ff", "#7c4dff", "#c084fc"],
  lavender: ["#e9d5ff", "#7c4dff", "#c084fc"],
  brown: ["#e9d5ff", "#7c4dff", "#c084fc"],
  navy: ["#e9d5ff", "#7c4dff", "#c084fc"],
};

/** 뽑기 전 카드 앞면에 쓰는 색 (서로 다른 3장을 랜덤으로 구성) */
export const FRONT_PALETTE = ["gold", "pink", "mint", "blue", "purple", "orange"];

export function cardGradient(color: string): string {
  const [a, b] = CARD_COLORS[color] ?? CARD_COLORS.gold;
  return `linear-gradient(155deg, ${a} 0%, ${b} 100%)`;
}

export function cardGlow(color: string): string {
  return (CARD_COLORS[color] ?? CARD_COLORS.gold)[2];
}
