const STARS = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53 + 11) % 100,
  size: 2 + ((i * 7) % 3),
  delay: ((i * 13) % 30) / 10,
  duration: 2.5 + ((i * 5) % 20) / 10,
}));

/** 별빛 파티클 배경 (CSS 애니메이션: transform/opacity만 사용) */
export default function StarField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
