"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cardGlow, cardGradient } from "@/lib/colors";
import { assetUrl } from "@/lib/asset";

interface FrontProps {
  color?: string;
  className?: string;
}

/**
 * 고급스러운 보라색 타로 카드 앞면(뽑기 전):
 * 로열 벨벳 퍼플 그라데이션 + 골드 포일 이중 프레임 + 코너 아스트랄 오너먼트 +
 * 초승달·별자리 기하학 장식 + 중앙 타원 액자 속 귀여운 점술가 아기 부엉이 + TODAY 금박 레터링
 */
export function CardFront({ className = "" }: FrontProps) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl p-[6px] select-none ${className}`}
      style={{
        background:
          "linear-gradient(155deg, #4b278f 0%, #2b135c 48%, #180938 100%)",
        boxShadow:
          "0 14px 34px rgba(98, 54, 214, 0.52), 0 0 0 1.5px rgba(246, 214, 138, 0.72), inset 0 0 18px rgba(255, 223, 148, 0.22)",
      }}
    >
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
          {/* 골드 타원 테두리 & 별 장식 */}
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

            {/* 상·하·좌·우 금빛 다이아몬드 스타 */}
            <polygon points="60,8 63,15 60,22 57,15" fill="url(#goldGrad)" />
            <polygon points="60,128 63,135 60,142 57,135" fill="url(#goldGrad)" />
            <polygon points="7,75 13,72 19,75 13,78" fill="url(#goldGrad)" />
            <polygon points="101,75 107,72 113,75 107,78" fill="url(#goldGrad)" />
          </svg>

          {/* 타원 액자 안 귀여운 3D 점술가 부엉이 */}
          <div className="relative z-10 flex h-[74%] w-[74%] items-center justify-center overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl("/assets/owl/fortune-teller-owl.png")}
              alt=""
              draggable={false}
              className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(12,4,30,0.65)]"
            />
          </div>
        </div>

        {/* 하단 TODAY 금박 레터링 */}
        <div
          className="relative z-10 pb-0.5 text-[9.5px] font-extrabold tracking-[0.26em]"
          style={{
            background: "linear-gradient(180deg, #fff5cc 0%, #e4b44c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1px 6px rgba(246, 206, 108, 0.35)",
          }}
        >
          TODAY
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
  onPick: () => void;
}

/** 카드 고르기 화면의 카드 1장: 부채꼴 등장 + 카드 섞기(셔플) 모션 + 둥실둥실 */
export default function Card({ color, index, dimmed, disabled, shuffling = false, onPick }: CardProps) {
  const reduce = useReducedMotion();
  const rotate = (index - 1) * 8;
  // 가운데 카드를 기준으로 좌/우 카드가 중앙으로 모였다가 교차하는 오프셋
  const centerOffset = (1 - index) * 105;

  return (
    <motion.button
      type="button"
      aria-label={`${index + 1}번째 타로 카드 선택`}
      disabled={disabled || shuffling}
      onClick={onPick}
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
              y: 0,
              rotate: reduce ? 0 : rotate,
              scale: dimmed ? 0.9 : 1,
            }
      }
      transition={
        shuffling
          ? { duration: 0.68, ease: "easeInOut" }
          : { duration: 0.55, delay: reduce ? 0 : 0.1 + index * 0.1, ease: "easeOut" }
      }
      whileHover={disabled || shuffling ? undefined : { y: -8, scale: 1.04 }}
      whileTap={{ scale: 1.06 }}
      className="relative aspect-[3/4.4] w-[30%] min-h-[44px]"
      style={{ transformOrigin: "50% 100%", zIndex: shuffling && index === 1 ? 20 : 10 }}
    >
      <div className="float h-full w-full" style={{ animationDelay: `${index * 0.5}s` }}>
        <CardFront color={color} />
      </div>
    </motion.button>
  );
}
