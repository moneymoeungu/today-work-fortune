import fortunesData from "@/data/fortunes.json";
import teamData from "@/data/teamKeywords.json";
import type { DrawnCard, Fortune, FortuneResult, LuckyLunch, Mood } from "./types";

export const FORTUNES = fortunesData as Fortune[];

/** 직장인 맞춤 오늘의 행운 점심 메뉴 풀 */
const LUCKY_LUNCHES: LuckyLunch[] = [
  { menu: "수제 등심 돈카츠", tip: "바삭한 첫입이 오후 결재운까지 시원하게 뚫어줘요" },
  { menu: "차돌 양지 쌀국수", tip: "따뜻한 국물이 집중력과 컨디션을 부드럽게 끌어올려요" },
  { menu: "김치찌개 & 계란말이", tip: "든든한 집밥 에너지가 퇴근까지 지치지 않게 해줘요" },
  { menu: "연어 포케 샐러드", tip: "산뜻한 한 끼로 오후 식곤증 없이 머리가 맑아져요" },
  { menu: "해물 순두부찌개", tip: "답답했던 고민이 국물처럼 개운하게 풀리는 메뉴예요" },
  { menu: "수제버거 & 감자튀김", tip: "기분 전환이 필요할 때 텐션을 단숨에 높여줘요" },
  { menu: "직화 제육볶음 쌈밥", tip: "동료들과 쌈 싸 먹으며 협업 시너지도 쑥쑥 올라가요" },
  { menu: "명란 오일 파스타", tip: "감각적인 한 접시가 반짝이는 기획 아이디어를 불러와요" },
  { menu: "들기름 막국수 & 수육", tip: "고소한 들기름 향이 마음을 차분하고 여유롭게 해줘요" },
  { menu: "바삭 꿔바로우 & 짬뽕", tip: "스트레스는 날리고 오후 추진력을 200% 충전해 줘요" },
  { menu: "뚝배기 불고기 정식", tip: "달콤짭짤한 맛처럼 오늘 대화와 소통이 술술 풀려요" },
  { menu: "초밥 모둠 & 미니우동", tip: "오늘 나에게 주는 작은 보상이 큰 행운을 데려와요" },
];

/** 2번: 오늘의 영혼 수혈 음료(카페인/티타임 처방) 풀 */
const LUCKY_DRINKS: string[] = [
  "샷 추가 아이스 바닐라 라떼",
  "얼음 가득 아이스 아메리카노",
  "상큼한 자몽 허니 블랙티",
  "달콤 쌉싸름 제주 말차 라떼",
  "피로 싹 풀리는 유자 레몬 에이드",
  "고소한 오트 디카페인 라떼",
  "향긋한 피치 얼그레이 티",
  "당 충전 헤이즐넛 초코 라떼",
];

/** 오늘의 업무 골든 타임 풀 */
const GOLDEN_TIMES: string[] = [
  "오전 10:00 ~ 11:30",
  "오후 1:30 ~ 3:00",
  "오후 2:00 ~ 4:00",
  "오후 3:00 ~ 5:00",
  "오전 10:30 ~ 12:00",
  "오후 4:00 ~ 퇴근 전",
];

/** 오늘의 찰떡 케미 동료 유형 풀 */
const BEST_PARTNERS: string[] = [
  "리액션 부자 동료 (칭찬에 시너지 2배)",
  "커피 타임을 함께하는 단짝 동료",
  "체크리스트를 잘 챙기는 꼼꼼파 동료",
  "아이디어가 통통 튀는 기획·마케팅 동료",
  "묵묵히 핵심만 짚어주는 해결사 동료",
  "유머로 회의 공기를 풀어주는 동료",
];

/** 1번: 오늘의 업무 금지어 / 피해야 할 행동 (유머 한 스푼) */
const TABOO_ACTIONS: string[] = [
  "“그냥 제가 다 할게요” 선뜻 외치기 금지",
  "점심 먹고 커피 내기 가위바위보 주의",
  "퇴근 10분 전 새로운 메일함 열기 금지",
  "회의 중 “혹시 이거 어때요?” 즉흥 발언 주의",
  "첨부파일 안 넣고 메일 보내기 버튼 주의",
  "오후 3시 간식 유혹에 무방비로 넘어가기 주의",
  "단톡방에 농담 보낼 때 방 이름 두 번 확인하기",
];

/** 4번: 운세 유형별 맞춤형 수호 부적 타이틀 */
const TALISMAN_MAP: Record<string, string> = {
  "presentation-king": "언변 폭발 · 박수갈채 부적",
  "approval-smooth": "결재 하이패스 · 무사통과 부적",
  "idea-planner": "아이디어 샘솟는 천재력 부적",
  "smart-growth": "일머리 만렙 · 초고속 성장 부적",
  "teamwork-synergy": "찰떡 호흡 · 팀워크 대통 부적",
  "focus-master": "잡념 차단 · 초집중 몰입 부적",
  "early-leave-fairy": "야근 퇴치 · 정시 칼퇴 수호 부적",
  "communication-pro": "오해 소멸 · 찰떡 소통 부적",
  "double-check": "실수 방어 · 무결점 철벽 부적",
  "recharge-day": "멘탈 보호 · 평온 충전 부적",
  "coffee-monday": "식곤증 퇴치 · 카페인 부스터 부적",
  "hidden-mvp": "인정 폭발 · 숨은 공로 발견 부적",
};

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

/** 카드 3장 구성. 직전 운세는 제외하고, 앞면은 서로 다른 타로 의상의 부엉이 3종(0, 1, 2)을 배치. */
export function drawCards(lastFortuneId: string | null): DrawnCard[] {
  const pool = FORTUNES.filter((f) => f.id !== lastFortuneId);
  const fortunes = shuffle(weightedPick(pool, 3));
  const variants = shuffle([0, 1, 2] as const);
  return fortunes.map((fortune, i) => ({
    fortune,
    frontColor: "purple",
    tarotVariant: variants[i],
  }));
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

/** 3번: 운세 분위기에 맞는 기분 좋은 정시 퇴근(칼퇴) 확률 계산 */
function calcOnTimeLeaveRate(fortune: Fortune): number {
  if (fortune.id === "early-leave-fairy") return 99;
  if (fortune.mood === "great") return 92 + Math.floor(Math.random() * 7); // 92~98%
  if (fortune.mood === "good") return 84 + Math.floor(Math.random() * 9); // 84~92%
  if (fortune.mood === "normal") return 78 + Math.floor(Math.random() * 8); // 78~85%
  return 72 + Math.floor(Math.random() * 9); // 72~80% (주의/유머여도 사기 저하 없게 70% 이상!)
}

export function buildResult(fortune: Fortune, name: string, team: string): FortuneResult {
  const luckyLunch = LUCKY_LUNCHES[Math.floor(Math.random() * LUCKY_LUNCHES.length)];
  const luckyDrink = LUCKY_DRINKS[Math.floor(Math.random() * LUCKY_DRINKS.length)];
  const goldenTime = GOLDEN_TIMES[Math.floor(Math.random() * GOLDEN_TIMES.length)];
  const bestPartner = BEST_PARTNERS[Math.floor(Math.random() * BEST_PARTNERS.length)];
  const tabooAction = TABOO_ACTIONS[Math.floor(Math.random() * TABOO_ACTIONS.length)];
  const onTimeLeaveRate = calcOnTimeLeaveRate(fortune);
  const talismanTitle = TALISMAN_MAP[fortune.id] ?? "만사형통 · 행운 수호 부적";

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
    luckyDrink,
    goldenTime,
    bestPartner,
    tabooAction,
    onTimeLeaveRate,
    talismanTitle,
  };
}

export function isLucky(mood: Mood): boolean {
  return mood === "great";
}
