import fortunesData from "@/data/fortunes.json";
import teamData from "@/data/teamKeywords.json";
import { FRONT_PALETTE } from "./colors";
import type { DrawnCard, Fortune, FortuneResult, Mood } from "./types";

export const FORTUNES = fortunesData as Fortune[];

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
  };
}

export function isLucky(mood: Mood): boolean {
  return mood === "great";
}
