/** 카드 색상 팔레트: [밝은색, 진한색, 글로우] */
export const CARD_COLORS: Record<string, [string, string, string]> = {
  gold: ["#ffe08a", "#e0a526", "#ffcf5c"],
  red: ["#ff8a8a", "#d62f4b", "#ff5d73"],
  yellow: ["#fff39a", "#f2c200", "#ffe53d"],
  purple: ["#c9a6ff", "#7c4dff", "#a97bff"],
  orange: ["#ffbe85", "#f2701c", "#ff9a4d"],
  blue: ["#9ccbff", "#2f7be0", "#5aa2ff"],
  mint: ["#a6f0d8", "#1fb893", "#4de0b8"],
  pink: ["#ffb3d1", "#e6458d", "#ff7fb2"],
  green: ["#b5ee9a", "#3fa535", "#7ad65f"],
  lavender: ["#ddd0ff", "#9b82e6", "#bba8ff"],
  brown: ["#e0b995", "#8a5a33", "#c28a5a"],
  navy: ["#8aa0ff", "#24378f", "#5a74e6"],
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
