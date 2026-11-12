import fortunesData from "@/data/fortunes.json";
import teamData from "@/data/teamKeywords.json";
import type { DrawnCard, Fortune, FortuneResult, LuckyLunch, Mood } from "./types";

export const FORTUNES = fortunesData as Fortune[];

/** 직장인 맞춤 오늘의 행운 점심 메뉴 풀 */
const LUCKY_LUNCHES: LuckyLunch[] = [
  { menu: "바삭한 수제 등심 돈카츠 🍱", tip: "바삭한 첫입이 오후 업무까지 시원하게 뚫어줘요" },
  { menu: "뜨끈한 차돌 양지 쌀국수 🍜", tip: "따뜻한 국물이 집중력과 컨디션을 부드럽게 끌어올려요" },
  { menu: "보글보글 김치찌개 & 계란말이 🥘", tip: "든든한 집밥 에너지가 퇴근까지 지치지 않게 해줘요" },
  { menu: "신선한 연어 포케 & 아메리카노 🥗", tip: "산뜻한 한 끼로 오후 식곤증 없이 머리가 맑아져요" },
  { menu: "얼큰 칼칼한 해물 순두부찌개 🍲", tip: "답답했던 고민이 국물처럼 개운하게 풀리는 메뉴예요" },
  { menu: "육즙 가득 수제버거 & 감자튀김 🍔", tip: "기분 전환이 필요할 때 텐션을 단숨에 높여줘요" },
  { menu: "매콤달콤 제육볶음 & 쌈채소 🥬", tip: "동료들과 쌈 싸 먹으며 협업 시너지도 쑥쑥 올라가요" },
  { menu: "쫄깃한 명란 오일 파스타 🍝", tip: "감각적인 한 접시가 반짝이는 기획 아이디어를 불러와요" },
  { menu: "속 편한 들기름 막국수 & 수육 🥢", tip: "고소한 들기름 향이 마음을 차분하고 여유롭게 해줘요" },
  { menu: "바삭 쫀득 꿔바로우 & 짬뽕 🥟", tip: "스트레스는 날리고 오후 추진력을 200% 충전해 줘요" },
  { menu: "따끈한 뚝배기 불고기 🥩", tip: "달콤짭짤한 맛처럼 오늘 대화와 소통이 술술 풀려요" },
  { menu: "초밥 모둠 세트 & 우동 🍣", tip: "오늘 나에게 주는 작은 보상이 큰 행운을 데려와요" },
];

/** 분위기 그룹별 총 확률 가중치 (좋음/대박 65, 보통 20, 주의·유머 15) */
const GROUP_WEIGHT = { positive: 65, normal: 20, low: 15 } as const;
type Group = keyof typeof GROUP_WEIGHT;

function groupOf(mood: Mood): Group {
  if (mood === "great" || mood === "good") return "positive";
  if (mood === "normal") return "normal";
  return "low";
}

const GROUP_COUNT: Record<Group, number> = FORTUNES.reduce(
  (acc, f) => {
    acc[groupOf(f.mood)] += 1;
    return acc;
  },
  { positive: 0, normal: 0, low: 0 } as Record<Group, number>,
);

function weightOf(f: Fortune): number {
  const g = groupOf(f.mood);
  return GROUP_WEIGHT[g] / GROUP_COUNT[g];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 가중치 랜덤으로 서로 다른 n개를 뽑는다. */
function weightedPick(pool: Fortune[], n: number): Fortune[] {
  const rest = [...pool];
  const picked: Fortune[] = [];
  while (picked.length < n && rest.length > 0) {
    const total = rest.reduce((s, f) => s + weightOf(f), 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let i = 0; i < rest.length; i++) {
      r -= weightOf(rest[i]);
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    picked.push(rest.splice(idx, 1)[0]);
  }
  return picked;
}

/** 카드 3장 구성. 직전 운세는 제외하고, 앞면 색은 모두 고급스러운 보라색(purple) 타로 카드로 통일. */
export function drawCards(lastFortuneId: string | null): DrawnCard[] {
  const pool = FORTUNES.filter((f) => f.id !== lastFortuneId);
  const fortunes = shuffle(weightedPick(pool, 3));
  return fortunes.map((fortune) => ({ fortune, frontColor: "purple" }));
}

function jitter(base: number): number {
  const v = base + Math.floor(Math.random() * 3) - 1; // -1, 0, +1
  return Math.min(5, Math.max(1, v));
}

export function teamLineFor(team: string): string {
  const t = team.toLowerCase();
  for (const rule of teamData.rules) {
    if (rule.keywords.some((k) => t.includes(k.toLowerCase()))) return rule.text;
  }
  return teamData.default;
}

export function buildResult(fortune: Fortune, name: string, team: string): FortuneResult {
  const luckyLunch = LUCKY_LUNCHES[Math.floor(Math.random() * LUCKY_LUNCHES.length)];
  return {
    fortune,
    name,
    team,
    scores: {
      focus: jitter(fortune.scores.focus),
      teamwork: jitter(fortune.scores.teamwork),
      communication: jitter(fortune.scores.communication),
    },
    teamLine: teamLineFor(team),
    luckyLunch,
  };
}

export function isLucky(mood: Mood): boolean {
  return mood === "great";
}
