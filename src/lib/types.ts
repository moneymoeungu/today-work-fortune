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
  /** 5장 부채꼴 타로 카드 앞면 아르카나 번호 (0~4) */
  tarotVariant: 0 | 1 | 2 | 3 | 4;
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
