import Owl from "./Owl";
import { cardGlow } from "@/lib/colors";
import type { FortuneResult } from "@/lib/types";

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

/**
 * 이미지 저장용 레이아웃 (9:16, 1080×1920). 화면 밖에 렌더링되어 PNG로 변환된다.
 * html-to-image 호환을 위해 인라인 스타일만 사용한다.
 */
export default function ShareCard({ result, url }: { result: FortuneResult; url: string }) {
  const {
    fortune,
    scores,
    luckyLunch,
    luckyDrink,
    goldenTime,
    bestPartner,
    tabooAction,
    onTimeLeaveRate,
    talismanTitle,
  } = result;
  const glow = cardGlow(fortune.cardColor);
  const font = "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif";

  const rows: [string, number][] = [
    ["집중력", scores.focus],
    ["협업운", scores.teamwork],
    ["소통운", scores.communication],
  ];

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        padding: "75px 76px 50px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
        fontFamily: font,
        background: `radial-gradient(110% 60% at 50% 18%, ${glow}55 0%, #2a1665 45%, #140a2e 100%)`,
        wordBreak: "keep-all",
      }}
    >
      {/* 4번: 상단 행운 부적 캡슐 */}
      <div
        style={{
          padding: "12px 34px",
          borderRadius: 999,
          border: "2px solid rgba(252, 211, 77, 0.55)",
          background: "rgba(251, 191, 36, 0.16)",
          color: "#fde68a",
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 22,
        }}
      >
        🧧 오늘의 부엉이 부적 · {talismanTitle}
      </div>

      <div style={{ fontSize: 36, opacity: 0.85 }}>
        {result.team} {result.name}님은
      </div>
      <div style={{ fontSize: 74, fontWeight: 800, textAlign: "center", marginTop: 10, lineHeight: 1.18 }}>
        {fortune.title}
      </div>

      {/* 중앙 부엉이 + 3번 칼퇴 확률 결재 스탬프 */}
      <div style={{ position: "relative", marginTop: 32, marginBottom: 28 }}>
        <Owl src={fortune.characterImage} hat={fortune.hat} prop={fortune.prop} alt={fortune.title} size={410} />
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: 10,
            width: 168,
            height: 168,
            borderRadius: "50%",
            border: "4px solid #fda4af",
            background: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-12deg)",
            boxShadow: "0 12px 30px rgba(244, 63, 94, 0.55)",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, color: "#ffe4e6" }}>칼퇴확률</div>
          <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.05, color: "#ffffff" }}>
            {onTimeLeaveRate}%
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fde68a", marginTop: 2 }}>✦ 승인완료 ✦</div>
        </div>
      </div>

      {/* 카드 1: 핵심 3줄 */}
      <div
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.14)",
          borderRadius: 40,
          padding: "32px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxSizing: "border-box",
        }}
      >
        {fortune.lines.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 34, lineHeight: 1.32 }}>
            <span style={{ fontSize: 42 }}>{l.icon}</span>
            <span>{l.text}</span>
          </div>
        ))}
      </div>

      {/* 카드 2: 업무 지수 가로 3칸 + 2×2 벤토 그리드 + 주의보 */}
      <div
        style={{
          width: "100%",
          marginTop: 22,
          background: "rgba(255,255,255,0.14)",
          borderRadius: 40,
          padding: "30px 38px",
          boxSizing: "border-box",
        }}
      >
        {/* 가로 3칸 업무 지수 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            background: "rgba(0,0,0,0.22)",
            borderRadius: 28,
            padding: "18px 20px",
            marginBottom: 20,
          }}
        >
          {rows.map(([label, v]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, opacity: 0.8, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 30, color: "#ffd86b", letterSpacing: 3, marginTop: 4 }}>{stars(v)}</div>
            </div>
          ))}
        </div>

        {/* 2×2 벤토 그리드 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          <div style={{ width: "calc(50% - 8px)", background: "rgba(255,255,255,0.1)", borderRadius: 26, padding: "20px 24px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 24, opacity: 0.7 }}>🍀 행운의 업무템</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#fef3c7", marginTop: 6 }}>{fortune.luckyItem}</div>
          </div>
          <div style={{ width: "calc(50% - 8px)", background: "rgba(255,255,255,0.1)", borderRadius: 26, padding: "20px 24px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 24, opacity: 0.7 }}>⏰ 업무 골든타임</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#bae6fd", marginTop: 6 }}>{goldenTime}</div>
          </div>
          <div style={{ width: "calc(50% - 8px)", background: "rgba(255,255,255,0.1)", borderRadius: 26, padding: "20px 24px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 24, opacity: 0.7 }}>🍽️ 오늘의 행운 점심</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#fde68a", marginTop: 6 }}>{luckyLunch.menu}</div>
          </div>
          <div style={{ width: "calc(50% - 8px)", background: "rgba(255,255,255,0.1)", borderRadius: 26, padding: "20px 24px", boxSizing: "border-box" }}>
            <div style={{ fontSize: 24, opacity: 0.7 }}>☕ 영혼 수혈 음료</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#a7f3d0", marginTop: 6 }}>{luckyDrink}</div>
          </div>
        </div>

        {/* 귀인 동료 & 오늘의 주의보 */}
        <div
          style={{
            marginTop: 18,
            background: "rgba(0,0,0,0.18)",
            borderRadius: 26,
            padding: "18px 26px",
            fontSize: 28,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div>🤝 <b>찰떡 동료:</b> {bestPartner}</div>
          <div>🚫 <b>주의할 것:</b> {tabooAction}</div>
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 34, fontWeight: 700, textAlign: "center", color: "#fef3c7" }}>
        “{fortune.message}”
      </div>

      <div style={{ marginTop: "auto", fontSize: 24, opacity: 0.55 }}>{url}</div>
    </div>
  );
}
