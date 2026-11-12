import fortunesData from "@/data/fortunes.json";
import teamData from "@/data/teamKeywords.json";
import type { DrawnCard, Fortune, FortuneResult, LuckyLunch, Mood } from "./types";

export const FORTUNES = fortunesData as Fortune[];

/** 직장인 맞춤 오늘의 행운 점심 메뉴 풀 (24종으로 대폭 확장) */
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
  { menu: "부대찌개 & 라면사리", tip: "보글보글 끓는 전골처럼 팀 분위기도 화기애애해져요" },
  { menu: "닭갈비 철판볶음밥", tip: "매콤달콤한 에너지가 오후 피로를 싹 날려줘요" },
  { menu: "아보카도 명란 비빔밥", tip: "깔끔한 영양 밸런스가 두뇌 회전을 빠르게 해줘요" },
  { menu: "육회비빔밥 & 소고기뭇국", tip: "입맛 돋우는 별미가 오늘의 승부수를 도와줘요" },
  { menu: "마라탕 & 미니 꿔바로우", tip: "얼얼하고 개운한 맛이 묵은 스트레스를 단번에 날려요" },
  { menu: "바질 페스토 샌드위치 & 수프", tip: "가볍고 산뜻한 브런치 무드가 창의력을 깨워줘요" },
  { menu: "고등어 화덕구이 백반", tip: "담백하고 정갈한 한 상이 오늘의 집중력을 지켜줘요" },
  { menu: "카레라이스 & 새우튀김", tip: "향긋한 스파이스가 오후 업무 효율을 한 단계 높여줘요" },
  { menu: "평양냉면 & 녹두전", tip: "슴슴하고 시원한 육수가 복잡한 머릿속을 정돈해 줘요" },
  { menu: "차슈 돈코츠 라멘", tip: "진한 국물 한 숟가락이 오후 마감 돌파력을 채워줘요" },
  { menu: "불향 가득 오징어볶음", tip: "화끈한 불향이 나른한 오후의 텐션을 확 끌어올려요" },
  { menu: "리코타 치즈 샐러드 & 파니니", tip: "산뜻한 에너지로 퇴근까지 가벼운 컨디션을 유지해요" },
];

/** 오늘의 영혼 수혈 음료 풀 (16종으로 확장) */
const LUCKY_DRINKS: string[] = [
  "샷 추가 아이스 바닐라 라떼",
  "얼음 가득 아이스 아메리카노",
  "상큼한 자몽 허니 블랙티",
  "달콤 쌉싸름 제주 말차 라떼",
  "피로 싹 풀리는 유자 레몬 에이드",
  "고소한 오트 디카페인 라떼",
  "향긋한 피치 얼그레이 티",
  "당 충전 헤이즐넛 초코 라떼",
  "쫀득한 흑당 밀크티",
  "정신 번쩍 아인슈페너",
  "시원한 복숭아 아이스티 샷추가",
  "마음이 편안해지는 캐모마일 허브티",
  "달달하고 고소한 토피넛 라떼",
  "상쾌한 애플민트 탄산수",
  "부드러운 돌체 콜드브루",
  "비타민 가득 생과일 오렌지 주스",
];

/** 오늘의 업무 골든 타임 풀 (10종) */
const GOLDEN_TIMES: string[] = [
  "오전 09:30 ~ 11:00",
  "오전 10:00 ~ 11:30",
  "오전 10:30 ~ 12:00",
  "오후 1:15 ~ 2:45",
  "오후 1:30 ~ 3:00",
  "오후 2:00 ~ 4:00",
  "오후 2:30 ~ 4:30",
  "오후 3:00 ~ 5:00",
  "오후 3:30 ~ 5:30",
  "오후 4:00 ~ 퇴근 전",
];

/** 오늘의 찰떡 케미 동료 유형 풀 (12종) */
const BEST_PARTNERS: string[] = [
  "리액션 부자 동료 (칭찬에 시너지 2배!)",
  "커피 타임을 함께하는 단짝 동료",
  "체크리스트를 잘 챙기는 꼼꼼파 동료",
  "아이디어가 통통 튀는 기획·마케팅 동료",
  "묵묵히 핵심만 짚어주는 해결사 동료",
  "유머로 회의 공기를 풀어주는 동료",
  "단축키와 엑셀 꿀팁을 잘 아는 스마트 동료",
  "점심 메뉴를 기가 막히게 고르는 미식가 동료",
  "일정을 한발 앞서 챙겨주는 든든한 동료",
  "내 의견에 가장 먼저 고개 끄덕여 주는 동료",
  "간식 서랍이 늘 풍성한 나눔 요정 동료",
  "타 부서 소통을 매끄럽게 이어주는 마당발 동료",
];

/** 오늘의 업무 주의보 풀 (14종) */
const TABOO_ACTIONS: string[] = [
  "“그냥 제가 다 할게요” 선뜻 외치기 금지",
  "점심 먹고 커피 내기 가위바위보 주의",
  "퇴근 10분 전 새로운 메일함 열기 금지",
  "회의 중 “혹시 이거 어때요?” 즉흥 발언 주의",
  "첨부파일 안 넣고 메일 보내기 버튼 주의",
  "오후 3시 간식 유혹에 무방비로 넘어가기 주의",
  "단톡방에 농담 보낼 때 방 이름 두 번 확인하기",
  "저장(Ctrl+S) 안 누르고 창 닫기 주의",
  "점심시간에 너무 무거운 주제로 이야기하기 금지",
  "바쁜 오전에 알림창 다 켜두고 멀티태스킹 주의",
  "“금방 끝나요”라고 마감 시간 너무 타이트하게 잡기 주의",
  "빈속에 고카페인 커피 연달아 마시기 주의",
  "전체 답장(Reply All)과 개인 답장 버튼 헷갈리지 않기",
  "완벽주의 때문에 첫 초안 공유를 너무 미루지 않기",
];

/** 뽑을 때마다 새로운 느낌을 주는 추가 한 줄 운세 보너스 풀 */
const BONUS_WORK_LINES: Record<Mood, { icon: string; text: string }[]> = {
  great: [
    { icon: "✨", text: "오전에 처리한 일 하나가 오후 내내 든든한 여유를 만들어줘요." },
    { icon: "🎯", text: "우선순위 1번 과제에서 기대 이상의 깔끔한 결과가 나와요." },
    { icon: "🌟", text: "내 의견이 회의나 메신저에서 기분 좋게 채택되는 흐름이에요." },
  ],
  good: [
    { icon: "🍀", text: "막히던 부분이 있으면 오후 티타임 직후에 자연스럽게 풀려요." },
    { icon: "💡", text: "평소 쓰던 템플릿을 살짝만 다듬어도 작업 속도가 확 빨라져요." },
    { icon: "🙌", text: "주변 동료와 짧게 현황만 공유해도 일이 훨씬 수월해져요." },
  ],
  normal: [
    { icon: "🧭", text: "순서만 차분히 적어 두고 시작하면 흔들림 없이 완주할 수 있어요." },
    { icon: "📌", text: "익숙한 방식대로 차근차근 진행하는 것이 가장 빠른 지름길이에요." },
  ],
  caution: [
    { icon: "🌿", text: "한 번에 하나씩만 처리해도 오늘 목표한 분량은 충분히 끝나요." },
    { icon: "🍵", text: "잠깐 창밖을 보거나 물 한 잔 마시는 여유가 실수를 막아줘요." },
  ],
  humor: [
    { icon: "🍩", text: "기분 좋은 간식이나 음료 하나가 오후 집중력을 두 배로 깨워줘요." },
    { icon: "😄", text: "가벼운 농담 한마디에 팀 분위기가 한결 부드러워지는 날이에요." },
  ],
};

/** 24종 운세별 맞춤형 수호 부적 타이틀 */
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
  "bonus-windfall": "성과 폭발 · 두둑한 보상 부적",
  "meeting-shortener": "회의 단축 · 핵심 종결 부적",
  "praise-relay": "칭찬 릴레이 · 평판 상승 부적",
  "creative-spark": "문서 술술 · 일필휘지 부적",
  "career-jump": "커리어 점프 · 능력치 상승 부적",
  "lucky-helper": "귀인 상봉 · 든든한 원군 부적",
  "deadline-clear": "숙제 올클리어 · 마감 돌파 부적",
  "evening-freedom": "저녁이 있는 삶 · 워라밸 수호 부적",
  "negotiation-master": "협상 타결 · 설득의 달인 부적",
  "calm-organizer": "쾌속 정리 · 질서 정연 부적",
  "mental-shield": "스트레스 반사 · 평정심 수호 부적",
  "lunch-jackpot": "맛집 당첨 · 소확행 충전 부적",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 5장 부채꼴(Fan Spread) 타로 카드 구성.
 * - 특정 카드에 확률이 몰리지 않도록 균등 셔플을 사용하고,
 *   최근에 뽑았던 카드들(recentIds)은 제외해 매일/매번 뽑을 때마다 다채로운 카드가 나오도록 구성.
 */
export function drawCards(recentIds: string[] | string | null = null): DrawnCard[] {
  const excludeSet = new Set(
    Array.isArray(recentIds) ? recentIds : recentIds ? [recentIds] : [],
  );
  let pool = FORTUNES.filter((f) => !excludeSet.has(f.id));
  if (pool.length < 5) {
    pool = [...FORTUNES];
  }
  const picked = shuffle(pool).slice(0, 5);
  const variants: (0 | 1 | 2 | 3 | 4)[] = [0, 1, 2, 3, 4];

  return picked.map((fortune, i) => ({
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

function calcOnTimeLeaveRate(fortune: Fortune): number {
  if (fortune.id === "early-leave-fairy" || fortune.id === "evening-freedom") return 99;
  if (fortune.mood === "great") return 91 + Math.floor(Math.random() * 8); // 91~98%
  if (fortune.mood === "good") return 84 + Math.floor(Math.random() * 9); // 84~92%
  if (fortune.mood === "normal") return 79 + Math.floor(Math.random() * 8); // 79~86%
  return 74 + Math.floor(Math.random() * 8); // 74~81%
}

export function buildResult(fortune: Fortune, name: string, team: string): FortuneResult {
  const luckyLunch = LUCKY_LUNCHES[Math.floor(Math.random() * LUCKY_LUNCHES.length)];
  const luckyDrink = LUCKY_DRINKS[Math.floor(Math.random() * LUCKY_DRINKS.length)];
  const goldenTime = GOLDEN_TIMES[Math.floor(Math.random() * GOLDEN_TIMES.length)];
  const bestPartner = BEST_PARTNERS[Math.floor(Math.random() * BEST_PARTNERS.length)];
  const tabooAction = TABOO_ACTIONS[Math.floor(Math.random() * TABOO_ACTIONS.length)];
  const onTimeLeaveRate = calcOnTimeLeaveRate(fortune);
  const talismanTitle = TALISMAN_MAP[fortune.id] ?? "만사형통 · 행운 수호 부적";

  // 같은 카드를 다른 날 뽑아도 3번째 줄이 동적으로 변주되어 더욱 풍성하게 느껴지도록 구성
  const bonusPool = BONUS_WORK_LINES[fortune.mood] ?? BONUS_WORK_LINES.good;
  const useBonus = Math.random() < 0.5 && fortune.lines.length >= 3;
  const variedLines = useBonus
    ? [
        fortune.lines[0],
        fortune.lines[1],
        bonusPool[Math.floor(Math.random() * bonusPool.length)],
      ]
    : fortune.lines;

  return {
    fortune: {
      ...fortune,
      lines: variedLines,
    },
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
