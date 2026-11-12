import Owl from "./Owl";
import { cardGlow } from "@/lib/colors";
import type { FortuneResult } from "@/lib/types";

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

/**
 * 이미지 저장용 레이아웃 (9:16, 1080×1920). 화면 밖에 렌더링되어 PNG로 변환된다.
 * html-to-image 호환을 위해 인라인 스타일만 사용한다.
 */
export default function ShareCard({ result, url }: { result: FortuneResult; url: string }) {
  const { fortune, scores, luckyLunch, goldenTime, bestPartner } = result;
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
        padding: "85px 80px 55px",
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
      <div style={{ fontSize: 38, opacity: 0.85 }}>
        {result.team} {result.name}님은
      </div>
      <div style={{ fontSize: 78, fontWeight: 800, textAlign: "center", marginTop: 14, lineHeight: 1.2 }}>
        {fortune.title}
      </div>

      <div style={{ marginTop: 40, marginBottom: 34 }}>
        <Owl src={fortune.characterImage} hat={fortune.hat} prop={fortune.prop} alt={fortune.title} size={450} />
      </div>

      <div
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.14)",
          borderRadius: 44,
          padding: "36px 46px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {fortune.lines.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 36, lineHeight: 1.35 }}>
            <span style={{ fontSize: 46 }}>{l.icon}</span>
            <span>{l.text}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          marginTop: 26,
          background: "rgba(255,255,255,0.14)",
          borderRadius: 44,
          padding: "34px 46px",
          fontSize: 34,
        }}
      >
        {rows.map(([label, v]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span>{label}</span>
            <span style={{ color: "#ffd86b", letterSpacing: 4 }}>{stars(v)}</span>
          </div>
        ))}
        <div style={{ marginTop: 16, opacity: 0.92 }}>🍀 행운의 업무템: {fortune.luckyItem}</div>
        <div style={{ marginTop: 10, opacity: 0.92 }}>⏰ 업무 골든타임: {goldenTime}</div>
        <div style={{ marginTop: 10, opacity: 0.92 }}>🤝 오늘의 귀인 동료: {bestPartner}</div>
        <div style={{ marginTop: 10, opacity: 0.96, color: "#ffe599" }}>🍽️ 행운 점심 메뉴: {luckyLunch.menu}</div>
      </div>

      <div style={{ marginTop: 28, fontSize: 34, textAlign: "center", opacity: 0.95 }}>
        “{fortune.message}”
      </div>

      <div style={{ marginTop: "auto", fontSize: 26, opacity: 0.6 }}>{url}</div>
    </div>
  );
}
