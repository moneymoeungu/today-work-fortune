export type Mood = "great" | "good" | "normal" | "caution" | "humor";

export interface Fortune {
  id: string;
  title: string;
  mood: Mood;
  cardColor: string;
  characterImage: string;
  hat: string;
  prop: string;
  lines: { icon: string; text: string }[];
  scores: { focus: number; teamwork: number; communication: number };
  luckyItem: string;
  message: string;
}

export interface DrawnCard {
  fortune: Fortune;
  /** 카드 앞면(뽑기 전) 색상 이름 */
  frontColor: string;
  /** 카드 앞면 부엉이 타로 의상 테마 (0: 달의 점술가, 1: 별의 마법사, 2: 태양의 왕관) */
  tarotVariant: 0 | 1 | 2;
}

export interface LuckyLunch {
  menu: string;
  tip: string;
}

export interface FortuneResult {
  fortune: Fortune;
  name: string;
  team: string;
  scores: { focus: number; teamwork: number; communication: number };
  teamLine: string;
  luckyLunch: LuckyLunch;
  luckyDrink: string;
  goldenTime: string;
  bestPartner: string;
  tabooAction: string;
  onTimeLeaveRate: number;
  talismanTitle: string;
}
