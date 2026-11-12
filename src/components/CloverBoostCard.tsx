"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CloverBoostProps {
  baseLeaveRate: number;
  boosted: boolean;
  onBoostComplete: () => void;
}

async function fireCloverConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  confetti({
    particleCount: 45,
    spread: 68,
    origin: { y: 0.72 },
    colors: ["#34d399", "#10b981", "#a7f3d0", "#fde68a"],
  });
}

/**
 * 2번 요청: '오늘의 운세 높이기' 네잎클로버 컬러 충전 인터랙션 컴포넌트
 * - 초기 상태: 반투명한 유리/크리스탈 질감의 네잎클로버 모형
 * - 하단 바를 꾹 누르고 있으면(또는 여러 번 탭하면) 0% -> 100%로 에메랄드빛 행운 색상이 아래에서 위로 차오름
 * - 100% 도달 시 네잎클로버가 완성되며 칼퇴 확률과 오늘의 행운 지수가 상승함
 */
export default function CloverBoostCard({
  baseLeaveRate,
  boosted,
  onBoostComplete,
}: CloverBoostProps) {
  const [progress, setProgress] = useState(boosted ? 100 : 0);
  const [holding, setHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const completedRef = useRef(boosted);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const finishBoost = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setHolding(false);
    setProgress(100);
    onBoostComplete();
    void fireCloverConfetti();
  };

  const startHold = () => {
    if (completedRef.current) return;
    setHolding(true);
    lastTickRef.current = performance.now();

    const step = (now: number) => {
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      setProgress((prev) => {
        const next = Math.min(100, prev + (dt / 1350) * 100);
        if (next >= 100) {
          window.setTimeout(finishBoost, 0);
          return 100;
        }
        return next;
      });
      if (!completedRef.current) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const stopHold = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHolding(false);
    if (!completedRef.current) {
      // 짧게 탭한 경우에도 25%씩 채워져서 꾹 누르기/탭하기 모두 쾌적하게 작동
      setProgress((prev) => {
        if (prev >= 92) {
          window.setTimeout(finishBoost, 0);
          return 100;
        }
        return Math.min(100, Math.max(prev, Math.round(prev + 18)));
      });
    }
  };

  const pct = Math.round(progress);
  const boostedRate = Math.min(99, baseLeaveRate + 12);
  const currentRate = Math.round(baseLeaveRate + (boostedRate - baseLeaveRate) * (pct / 100));

  // SVG 클립 영역 계산 (y=152 바닥에서 y=16 꼭대기까지 차오름)
  const fillY = 152 - (136 * pct) / 100;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-md">
      {/* 상단 타이틀 & 실시간 행운 지수 뱃지 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold tracking-tight text-emerald-300/90">
            오늘의 운세 높이기
          </p>
          <h3 className="mt-0.5 text-[17px] font-bold tracking-tight text-white">
            {boosted
              ? "네잎클로버 행운 충전이 완료됐어요"
              : "바를 꾹 눌러 네잎클로버를 채워보세요"}
          </h3>
        </div>
        <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-right">
          <span className="text-[12px] font-bold text-emerald-300">
            칼퇴운 {currentRate}%
          </span>
        </div>
      </div>

      {/* 중앙 3D 반투명 네잎클로버 모형 -> 색상이 차오르는 영역 */}
      <div className="my-5 flex flex-col items-center justify-center">
        <motion.div
          animate={
            holding
              ? { scale: [1, 1.06, 1.03], rotate: [0, -2, 2, 0] }
              : boosted
                ? { scale: [1, 1.04, 1] }
                : { scale: 1 }
          }
          transition={{ duration: 0.6, repeat: holding ? Infinity : 0 }}
          className="relative flex h-36 w-36 items-center justify-center"
        >
          {/* 충전량에 따라 뒤에 퍼지는 에메랄드 광채 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2 rounded-full blur-2xl transition-opacity duration-200"
            style={{
              background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
              opacity: (pct / 100) * 0.55,
            }}
          />

          <svg viewBox="0 0 168 168" className="h-36 w-36 overflow-visible" aria-hidden>
            <defs>
              {/* 네잎클로버 4개의 하트 잎 + 줄기 실루엣 패스 */}
              <g id="cloverShape">
                {/* 상단 잎 */}
                <path d="M84 80 C84 52 50 32 58 18 C64 8 78 12 84 24 C90 12 104 8 110 18 C118 32 84 52 84 80 Z" />
                {/* 하단 잎 */}
                <path d="M84 88 C84 116 50 136 58 150 C64 160 78 156 84 144 C90 156 104 160 110 150 C118 136 84 116 84 88 Z" />
                {/* 좌측 잎 */}
                <path d="M80 84 C52 84 32 50 18 58 C8 64 12 78 24 84 C12 90 8 104 18 110 C32 118 52 84 80 84 Z" />
                {/* 우측 잎 */}
                <path d="M88 84 C116 84 136 50 150 58 C160 64 156 78 144 84 C156 90 160 104 150 110 C136 118 116 84 88 84 Z" />
                {/* 중앙 코어 & 살짝 휜 줄기 */}
                <circle cx="84" cy="84" r="9" />
                <path
                  d="M84 90 Q86 130 104 154"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </g>

              {/* 투명 유리 모형 그라데이션 */}
              <linearGradient id="cloverGlass" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.14" />
              </linearGradient>

              {/* 차오르는 에메랄드 행운 컬러 그라데이션 */}
              <linearGradient id="cloverFillGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#6ee7b7" />
              </linearGradient>

              {/* 아래에서 위로 차오르는 액체 클립 마스크 */}
              <clipPath id="cloverLiquidClip">
                <rect x="0" y={fillY} width="168" height="168" rx="8" />
              </clipPath>
            </defs>

            {/* 1. 기본 반투명 유리 모형 (빈 상태) */}
            <use
              href="#cloverShape"
              fill="url(#cloverGlass)"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.8"
            />

            {/* 2. 클립 마스크로 차오르는 에메랄드 행운 컬러 */}
            <g clipPath="url(#cloverLiquidClip)">
              <use
                href="#cloverShape"
                fill="url(#cloverFillGrad)"
                stroke="#a7f3d0"
                strokeWidth="1.8"
              />
              {/* 잎사귀 입체 하이라이트 광택 */}
              <circle cx="72" cy="36" r="6" fill="#ffffff" opacity="0.28" />
              <circle cx="36" cy="72" r="6" fill="#ffffff" opacity="0.25" />
              <circle cx="132" cy="72" r="6" fill="#ffffff" opacity="0.25" />
              <circle cx="72" cy="132" r="6" fill="#ffffff" opacity="0.2" />
            </g>

            {/* 3. 중앙 퍼센트 또는 완료 빛망울 */}
            <circle
              cx="84"
              cy="84"
              r="18"
              fill="rgba(16, 12, 38, 0.62)"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.2"
            />
            <text
              x="84"
              y="88"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11.5"
              fontWeight="800"
            >
              {pct}%
            </text>
          </svg>
        </motion.div>

        <p className="mt-1 text-center text-[12.5px] font-medium text-white/60">
          {boosted
            ? "오늘의 칼퇴운과 행운 기운이 최대치로 채워졌어요!"
            : holding
              ? "행운의 에메랄드빛 기운이 차오르고 있어요…"
              : "네잎클로버가 가득 채워지면 오늘의 칼퇴 확률이 올라가요"}
        </p>
      </div>

      {/* 하단 꾹 누르기 게이지 바 버튼 */}
      <button
        type="button"
        disabled={boosted}
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        onPointerCancel={stopHold}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex h-[52px] w-full select-none items-center justify-center overflow-hidden rounded-2xl border border-emerald-300/30 bg-black/30 px-5 text-[14.5px] font-bold text-white shadow-inner transition active:scale-[0.99] disabled:cursor-default"
      >
        {/* 버튼 내부 채워지는 프로그레스 바 */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 transition-all duration-75"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #059669 0%, #10b981 60%, #34d399 100%)",
          }}
        />
        <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
          {boosted ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>오늘의 행운 충전 완료 (+12% UP)</span>
            </>
          ) : (
            <span>{holding ? `행운 채우는 중… ${pct}%` : "길게 꾹 눌러서 행운 채우기"}</span>
          )}
        </span>
      </button>
    </div>
  );
}
