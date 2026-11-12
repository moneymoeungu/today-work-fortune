"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cardGlow, cardGradient } from "@/lib/colors";
import { assetUrl } from "@/lib/asset";
import type { Fortune } from "@/lib/types";

interface FrontProps {
  color?: string;
  variant?: 0 | 1 | 2;
  charge?: number; // 0 ~ 100 기운 모으기 게이지
  className?: string;
}

const TAROT_ARCANA = [
  {
    owlSrc: "/assets/owl/fortune-teller-owl.png",
    label: "I · MOON",
    aura: "rgba(130, 185, 255, 0.42)",
    innerTop: "#5a38c2",
  },
  {
    owlSrc: "/assets/owl/tarot-star-owl.png",
    label: "II · STAR",
    aura: "rgba(255, 222, 130, 0.42)",
    innerTop: "#6c3fd1",
  },
  {
    owlSrc: "/assets/owl/tarot-sun-owl.png",
    label: "III · SUN",
    aura: "rgba(255, 182, 145, 0.42)",
    innerTop: "#7d3bc8",
  },
] as const;

/**
 * 고급스러운 보라색 타로 카드 앞면(뽑기 전):
 * 카드마다 서로 다른 타로 아르카나(달·별·태양) 의상의 아기 부엉이와 천체 심볼이 연출된다.
 */
export function CardFront({ variant = 0, charge = 0, className = "" }: FrontProps) {
  const isCharging = charge > 0;
  const arcana = TAROT_ARCANA[variant] ?? TAROT_ARCANA[0];

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
          background: `radial-gradient(circle at 50% 44%, ${arcana.aura} 0%, rgba(88, 42, 179, 0.14) 50%, transparent 75%)`,
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
            <linearGradient id={`tarotGold-${variant}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1b8" />
              <stop offset="50%" stopColor="#e5b857" />
              <stop offset="100%" stopColor="#b98728" />
            </linearGradient>
          </defs>
          <g stroke={`url(#tarotGold-${variant})`} strokeWidth="0.95" fill="none" opacity="0.88">
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

        {/* 상단 천체 심볼 (카드별 달 / 별 / 태양 다르게 연출) */}
        <div className="relative z-10 flex w-full items-center justify-center gap-1 pt-0.5 text-[#f7dca1]">
          <span className="text-[8px] opacity-80">✧</span>
          {variant === 0 && (
            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current drop-shadow">
              <path d="M14.5 3.5a8.5 8.5 0 1 0 6 14.5 7 7 0 1 1-6-14.5Z" />
            </svg>
          )}
          {variant === 1 && (
            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current drop-shadow">
              <path d="M12 2 L14.4 9.6 L22 12 L14.4 14.4 L12 22 L9.6 14.4 L2 12 L9.6 9.6 Z" />
            </svg>
          )}
          {variant === 2 && (
            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current drop-shadow">
              <circle cx="12" cy="12" r="5" />
              <path
                d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          <span className="text-[8px] opacity-80">✧</span>
        </div>

        {/* 중앙 타로 아스트랄 타원 액자 & 카드별 의상을 입은 아기 부엉이 */}
        <div className="relative z-10 my-auto flex aspect-[3/3.7] w-[84%] items-center justify-center">
          <svg
            aria-hidden
            viewBox="0 0 120 150"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_2px_10px_rgba(255,215,128,0.3)]"
          >
            <defs>
              <linearGradient id={`goldGrad-${variant}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff3c4" />
                <stop offset="45%" stopColor="#eab954" />
                <stop offset="100%" stopColor="#b57e1d" />
              </linearGradient>
              <radialGradient id={`innerOrb-${variant}`} cx="50%" cy="46%" r="54%">
                <stop offset="0%" stopColor={arcana.innerTop} stopOpacity="0.94" />
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
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="0.9"
              strokeDasharray="2.2 3"
              opacity="0.75"
            />
            <ellipse
              cx="60"
              cy="75"
              rx="47"
              ry="60"
              fill={`url(#innerOrb-${variant})`}
              stroke={`url(#goldGrad-${variant})`}
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
              stroke={`url(#goldGrad-${variant})`}
              strokeWidth="0.7"
              opacity="0.55"
            />

            <polygon points="60,8 63,15 60,22 57,15" fill={`url(#goldGrad-${variant})`} />
            <polygon points="60,128 63,135 60,142 57,135" fill={`url(#goldGrad-${variant})`} />
            <polygon points="7,75 13,72 19,75 13,78" fill={`url(#goldGrad-${variant})`} />
            <polygon points="101,75 107,72 113,75 107,78" fill={`url(#goldGrad-${variant})`} />
          </svg>

          {/* 타원 액자 안 서로 다른 타로 의상을 입은 3D 아기 부엉이 */}
          <div
            className="relative z-10 flex h-[76%] w-[76%] items-center justify-center overflow-hidden rounded-full transition-transform duration-150"
            style={{ transform: isCharging ? `scale(${1 + charge * 0.0018})` : undefined }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetUrl(arcana.owlSrc)}
              alt=""
              draggable={false}
              className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(12,4,30,0.65)]"
            />
          </div>
        </div>

        {/* 하단 아르카나 라벨 또는 기운 % 표시 */}
        <div
          className="relative z-10 pb-0.5 text-[9px] font-extrabold tracking-[0.2em]"
          style={{
            background: "linear-gradient(180deg, #fff5cc 0%, #e4b44c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 1px 6px rgba(246, 206, 108, 0.35)",
          }}
        >
          {isCharging ? `✦ ${Math.min(100, Math.round(charge))}% ✦` : arcana.label}
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

/**
 * 카드 뒷면(뒤집힌 순간 나타나는 운명의 타로 앞면):
 * 기존 시스템 이모지 대신, 정교한 골드 마법진(Sacred Geometry SVG)과
 * 뽑힌 운세의 실제 3D 부엉이 캐릭터 + 운세 타이틀 리본이 화려하게 등장한다.
 */
export function CardBack({ fortune }: { fortune: Fortune }) {
  const glow = cardGlow(fortune.cardColor);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-2xl p-[7px] select-none"
      style={{
        background: "linear-gradient(160deg, #2e1563 0%, #1b0b3d 55%, #110629 100%)",
        boxShadow: `0 0 65px ${glow}, 0 0 0 2px rgba(255, 228, 150, 0.92), inset 0 0 28px ${glow}55`,
      }}
    >
      {/* 운세 컬러 후광 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${glow}66 0%, transparent 68%)`,
        }}
      />

      {/* 내부 골드 아르카나 프레임 */}
      <div
        className="relative flex h-full w-full flex-col items-center justify-between rounded-xl px-3 py-3"
        style={{
          border: "1.5px solid rgba(255, 224, 142, 0.72)",
          boxShadow: "inset 0 0 0 3px rgba(255, 224, 142, 0.16)",
        }}
      >
        {/* 배경 신성 기하학 마법진 & 별자리 링 SVG */}
        <svg
          aria-hidden
          viewBox="0 0 200 280"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="revealGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff6cc" />
              <stop offset="50%" stopColor="#f0c15a" />
              <stop offset="100%" stopColor="#b88121" />
            </linearGradient>
          </defs>

          {/* 코너 장식 */}
          <g stroke="url(#revealGold)" strokeWidth="1.2" fill="none" opacity="0.85">
            <path d="M8,24 L8,8 L24,8" />
            <path d="M192,24 L192,8 L176,8" />
            <path d="M8,256 L8,272 L24,272" />
            <path d="M192,256 L192,272 L176,272" />
          </g>

          {/* 중앙 회전 마법진 (Sacred Geometry) */}
          <g transform="translate(100, 128)" stroke="url(#revealGold)" fill="none">
            <circle cx="0" cy="0" r="72" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.65" />
            <circle cx="0" cy="0" r="64" strokeWidth="1.4" opacity="0.85" />
            <circle cx="0" cy="0" r="52" strokeWidth="0.7" opacity="0.5" />
            {/* 8각 별 만다라 */}
            <rect x="-44" y="-44" width="88" height="88" strokeWidth="0.8" opacity="0.45" />
            <rect x="-44" y="-44" width="88" height="88" strokeWidth="0.8" opacity="0.45" transform="rotate(45)" />
            {/* 동서남북 다이아몬드 광선 */}
            <polygon points="0,-78 4,-68 0,-58 -4,-68" fill="url(#revealGold)" stroke="none" />
            <polygon points="0,78 4,68 0,58 -4,68" fill="url(#revealGold)" stroke="none" />
            <polygon points="-78,0 -68,-4 -58,0 -68,4" fill="url(#revealGold)" stroke="none" />
            <polygon points="78,0 68,-4 58,0 68,4" fill="url(#revealGold)" stroke="none" />
          </g>
        </svg>

        {/* 상단 아르카나 헤더 */}
        <div className="relative z-10 flex items-center gap-1.5 pt-0.5">
          <span className="text-[10px] text-[#ffe8a3]">✦</span>
          <span
            className="text-[10px] font-extrabold tracking-[0.26em]"
            style={{
              background: "linear-gradient(180deg, #fff7d6 0%, #e7b951 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TODAY&apos;S ARCANA
          </span>
          <span className="text-[10px] text-[#ffe8a3]">✦</span>
        </div>

        {/* 중앙 뽑힌 운세의 실제 3D 부엉이 캐릭터 */}
        <div className="relative z-10 my-auto flex h-[168px] w-[168px] items-center justify-center">
          <div
            className="absolute inset-2 rounded-full blur-xl"
            style={{ background: cardGradient(fortune.cardColor), opacity: 0.55 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetUrl(fortune.characterImage)}
            alt={fortune.title}
            draggable={false}
            className="relative z-10 h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(10,4,28,0.75)]"
          />
        </div>

        {/* 하단 골드 타로 타이틀 플레이트 */}
        <div
          className="relative z-10 w-full rounded-xl px-2.5 py-2 text-center"
          style={{
            background: "linear-gradient(180deg, rgba(35, 16, 78, 0.92) 0%, rgba(20, 8, 48, 0.96) 100%)",
            border: "1px solid rgba(255, 223, 138, 0.75)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
          }}
        >
          <p
            className="truncate text-[13px] font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #ffe6a3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {fortune.title}
          </p>
        </div>
      </div>

      {/* 유리 광택 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, transparent 45%, rgba(255,224,142,0.14) 100%)",
        }}
      />
    </div>
  );
}

interface CardProps {
  color: string;
  variant: 0 | 1 | 2;
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
  variant,
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
        <CardFront color={color} variant={variant} charge={charge} />
      </div>
    </motion.button>
  );
}
