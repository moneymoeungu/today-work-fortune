/** 한국 시간(KST) 기준 날짜 문자열 (YYYY-MM-DD). 자정(KST)에 바뀐다. */
export function todayKST(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}
