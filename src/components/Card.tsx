"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cardGlow, cardGradient } from "@/lib/colors";
import { assetUrl } from "@/lib/asset";

interface FrontProps {
  color?: string;
  charge?: number; // 0 ~ 100 기운 모으기 게이지
  className?: string;
}

/**
 * 고급스러운 보라색 타로 카드 앞면(뽑기 전):
 * 로열 벨벳 퍼플 그라데이션 + 골드 포일 이중 프레임 + 코너 아스트랄 오너먼트 +
 * 초승달·별자리 기하학 장식 + 중앙 타원 액자 속 귀여운 점술가 아기 부엉이 + TODAY 금박 레터링
 * + 꾹 누를 때 차오르는 황금빛 마법 기운 게이지
 */
export function CardFront({ charge = 0, className = "" }: FrontProps) {
  const isCharging = charge > 0;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl p-[6px] select-none transition-shadow duration-150 ${className}`}
      style={{
        background:
          "linear-gradient(155deg, #4b278f 0%, #2b135c 48%, #180938 100%)",
        boxShadow: isCharging
          ? `0 0 ${18 + charge * 0.38}px rgba(255, 215, 110, ${0.45 + charge * 0.005}), 0 0 0 2px rgba(255, 232, 156, 0.95), inset 0 0 ${16 + charge * 0.25}px rgba(255, 223, 130, 0.55)`
          : "0 14px 34px rgba(98, 54, 214, 0.52), 0 0 0 1.5px rgba(246, 214, 138, 0.72), inset 0 0 18px rgba(255, 223, 148, 0.22)",
      }}
    >
      {/* 기운 모으기 중일 때 아래에서 위로 차오르는 황금빛 오라 */}
      {isCharging && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 transition-all duration-75"
          style={{
            height: `${charge}%`,
            background:
              "linear-gradient(0deg, rgba(255, 214, 102, 0.42) 0%, rgba(196, 132, 255, 0.28) 65%, transparent 100%)",
          }}
        />
      )}

      {/* 배경 은하수 라디얼 광채 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(168, 118, 255, 0.34) 0%, rgba(88, 42, 179, 0.12) 48%, transparent 75%)",
        }}
      />

      {/* 내부 골드 포일 프레임 */}
      <div
        className="relative flex h-full w-full flex-col items-center justify-between rounded-[11px] px-1.5 py-2"
        style={{
          border: "1px solid rgba(247, 217, 140, 0.58)",
          boxShadow: "inset 0 0 0 2px rgba(247, 217, 140, 0.16)",
        }}
      >
        {/* 네 모서리 타로 오너먼트 SVG */}
        <svg
          aria-hidden
          viewBox="0 0 100 150"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="tarotGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1b8" />
              <stop offset="50%" stopColor="#e5b857" />
              <stop offset="100%" stopColor="#b98728" />
            </linearGradient>
          </defs>
          <g stroke="url(#tarotGold)" strokeWidth="0.95" fill="none" opacity="0.88">
            <path d="M4,14 L4,4 L14,4" />
            <path d="M96,14 L96,4 L86,4" />
            <path d="M4,136 L4,146 L14,146" />
            <path d="M96,136 L96,146 L86,146" />
            <path d="M14,8 Q50,18 86,8" strokeWidth="0.6" opacity="0.6" />
            <path d="M14,142 Q50,132 86,142" strokeWidth="0.6" opacity="0.6" />
          </g>
          <g fill="#ffe89e" opacity="0.75">
            <circle cx="18" cy="28" r="0.8" />
            <circle cx="82" cy="28" r="0.8" />
            <circle cx="14" cy="75" r="0.7" />
            <circle cx="86" cy="75" r="0.7" />
            <circle cx="18" cy="118" r="0.8" />
            <circle cx="82" cy="118" r="0.8" />
          </g>
        </svg>

        {/* 상단 천체(초승달 + 별빛) 심볼 */}
        <div className="relative z-10 flex w-full items-center justify-center gap-1 pt-0.5 text-[#f7dca1]">
          <span className="text-[8px] opacity-80">✧</span>
          <svg aria-hidden viewBox="0 0 24 24" className="h-3 w-3 fill-current drop-shadow">
            <path d="M14.5 3.5a8.5 8.5 0 1 0 6 14.5 7 7 0 1 1-6-14.5Z" />
          </svg>
          <span className="text-[8px] opacity-80">✧</span>
        </div>

        {/* 중앙 타로 아스트랄 타원 액자 & 귀여운 점술가 아기 부엉이 */}
        <div className="relative z-10 my-auto flex aspect-[3/3.7] w-[82%] items-center justify-center">
          <svg
            aria-hidden
            viewBox="0 0 120 150"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_2px_10px_rgba(255,215,128,0.3)]"
          >
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="45%" stopColor="#eab954" />
                <stop offset="100%" stopColor="#b57e1d" />
              </linearGradient>
              <radialGradient id="innerOrb" cx="50%" cy="46%" r="54%">
                <stop offset="0%" stopColor="#6c3fd1" stopOpacity="0.92" />
                <stop offset="65%" stopColor="#2c1366" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#160738" stopOpacity="1" />
              </radialGradient>
            </defs>

            <ellipse
              cx="60"
              cy="75"
              rx="53"
              ry="67"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="0.9"
              strokeDasharray="2.2 3"
              opacity="0.75"
            />
            <ellipse
              cx="60"
              cy="75"
              rx="47"
              ry="60"
              fill="url(#innerOrb)"
              stroke="url(#goldGrad)"
              strokeWidth="2.2"
            />

            {/* 기운 모으기 프로그레스 타원 링 */}
            {isCharging && (
              <ellipse
                cx="60"
                cy="75"
                rx="49"
                ry="62"
                fill="none"
                stroke="#fff6cc"
                strokeWidth="3.2"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${charge} 100`}
                transform="rotate(-90 60 75)"
              />
            )}

            <ellipse
              cx="60"
              cy="75"
              rx="42"
              ry="55"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="0.7"
              opacity="0.55"
            />

            <polygon points="60,8 63,15 60,22 57,15" fill="url(#goldGrad)" />
            <polygon points="60,128 63,135 60,142 57,135" fill="url(#goldGrad)" />
            <polygon points="7,75 13,72 19,75 13,78" fill="url(#goldGrad)" />
            <polygon points="101,75 107,72 113,75 107,78" fill="url(#goldGrad)" />
          </svg>

          {/* 타원 액자 안 귀여운 3D 점술가 부엉이 */}
          <div
            className="relative z-10 flex h-[74%] w-[74%] items-center justify-center overflow-hidden rounded-full transition-transform duration-150"
            style={{ transform: isCharging ? `scale(${1 + charge * 0.0018})` : undefined }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl("/assets/owl/fortune-teller-owl.png")}
              alt=""
              draggable={false}
              className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(12,4,30,0.65)]"
            />
          </div>
        </div>

        {/* 하단 TODAY 금박 레터링 또는 기운 % 표시 */}
        <div
          className="relative z-10 pb-0.5 text-[9.5px] font-extrabold tracking-[0.22em]"
          style={{
            background: "linear-gradient(180deg, #fff5cc 0%, #e4b44c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1px 6px rgba(246, 206, 108, 0.35)",
          }}
        >
          {isCharging ? `✦ ${Math.min(100, Math.round(charge))}% ✦` : "TODAY"}
        </div>
      </div>

      {/* 은은한 대각선 벨벳·유리 광택 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 38%, transparent 60%, rgba(247,215,148,0.12) 100%)",
        }}
      />
    </div>
  );
}

/** 카드 뒷면(뒤집힌 뒤): 결과 유형의 색상 + 신비로운 타로 프레임 */
export function CardBack({ color, emoji }: { color: string; emoji: string }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl p-2"
      style={{
        background: cardGradient(color),
        boxShadow: `0 0 60px ${cardGlow(color)}, 0 0 0 2px rgba(255, 236, 179, 0.85)`,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-white/60 bg-black/15 backdrop-blur-[2px]">
        <span className="text-[11px] tracking-[0.3em] text-white/80">✦ DESTINY ✦</span>
        <span className="my-3 text-[68px] drop-shadow-lg">{emoji}</span>
        <span className="text-[10px] font-bold tracking-[0.25em] text-white/90">OPEN</span>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-transparent to-transparent" />
    </div>
  );
}

interface CardProps {
  color: string;
  index: number;
  dimmed: boolean;
  disabled: boolean;
  shuffling?: boolean;
  charge?: number;
  onChargeStart: () => void;
  onChargeEnd: (cancelled: boolean) => void;
}

/** 카드 고르기 화면의 카드 1장: 부채꼴 등장 + 꾹 눌러 기운 모으기 + 카드 섞기 모션 */
export default function Card({
  color,
  index,
  dimmed,
  disabled,
  shuffling = false,
  charge = 0,
  onChargeStart,
  onChargeEnd,
}: CardProps) {
  const reduce = useReducedMotion();
  const rotate = (index - 1) * 8;
  const centerOffset = (1 - index) * 105;
  const isCharging = charge > 0;

  return (
    <motion.button
      type="button"
      aria-label={`${index + 1}번째 타로 카드 (꾹 눌러 기운 모으기)`}
      disabled={disabled || shuffling}
      onPointerDown={(e) => {
        if (disabled || shuffling) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        onChargeStart();
      }}
      onPointerUp={() => onChargeEnd(false)}
      onPointerCancel={() => onChargeEnd(true)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !shuffling) {
          e.preventDefault();
          onChargeStart();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChargeEnd(false);
        }
      }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 80, rotate: 0, scale: 0.8 }}
      animate={
        shuffling && !reduce
          ? {
              x: [0, centerOffset, -centerOffset * 0.45, centerOffset * 0.85, 0],
              y: [0, -18, -8, -14, 0],
              rotate: [rotate, 0, (1 - index) * 12, (index - 1) * 6, rotate],
              scale: [1, 0.96, 1.03, 0.98, 1],
              opacity: 1,
            }
          : {
              x: 0,
              opacity: dimmed ? 0.25 : 1,
              y: isCharging ? -14 : 0,
              rotate: reduce ? 0 : isCharging ? rotate * 0.35 : rotate,
              scale: dimmed ? 0.9 : isCharging ? 1.06 + charge * 0.0006 : 1,
            }
      }
      transition={
        shuffling
          ? { duration: 0.68, ease: "easeInOut" }
          : isCharging
            ? { duration: 0.12 }
            : { duration: 0.5, ease: "easeOut" }
      }
      className="relative aspect-[3/4.4] w-[30%] min-h-[44px] touch-none"
      style={{
        transformOrigin: "50% 100%",
        zIndex: isCharging ? 25 : shuffling && index === 1 ? 20 : 10,
      }}
    >
      <div className="float h-full w-full" style={{ animationDelay: `${index * 0.5}s` }}>
        <CardFront color={color} charge={charge} />
      </div>
    </motion.button>
  );
}
