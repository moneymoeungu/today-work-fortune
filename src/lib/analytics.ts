export type AnalyticsEvent =
  | "start"
  | "input_complete"
  | "card_select"
  | "result_view"
  | "image_save"
  | "share_click"
  | "retry";

/** GA4(gtag)가 설치되어 있으면 이벤트를 보내고, 없으면 아무것도 하지 않는다. */
export function track(event: AnalyticsEvent, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", event, params);
}
