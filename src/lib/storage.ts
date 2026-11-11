import { todayKST } from "./kst";

const PROFILE_KEY = "owl-fortune:profile";
const HISTORY_KEY = "owl-fortune:history";

export interface Profile {
  name: string;
  team: string;
}

export function loadProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    /* 저장 불가 환경(시크릿 모드 등)은 무시 */
  }
}

type History = Record<string, string[]>;

function readHistory(): History {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as History) : {};
  } catch {
    return {};
  }
}

/** 오늘(KST) 뽑은 운세 id 목록 */
export function getTodayHistory(): string[] {
  return readHistory()[todayKST()] ?? [];
}

/** 오늘 기록에 추가하고, 지난 날짜 기록은 정리한다. */
export function addToHistory(fortuneId: string): string[] {
  const today = todayKST();
  const list = readHistory()[today] ?? [];
  const next = [...list, fortuneId];
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ [today]: next }));
  } catch {
    /* ignore */
  }
  return next;
}
