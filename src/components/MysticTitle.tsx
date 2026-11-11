"use client";

import { motion } from "framer-motion";

/**
 * 첨부 레퍼런스('어느 깊은 밤 길을 잃어도') 스타일의 판타지·달빛 세리프 타이틀 로고.
 * - 배경 보름달 + 신비로운 소용돌이 아우라 + 흩날리는 빛 조각
 * - 은백색~아이스블루 메탈릭 그라데이션 세리프 서체
 * - 장식 스워시(곡선 획) + 십자 스타 플레어(✦) + 푸른 물방울 보석 포인트
 */
export default function MysticTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="relative mx-auto flex w-full max-w-[360px] flex-col items-center justify-center py-2 select-none"
    >
      {/* 배경 보름달 & 소용돌이 아우라 & 빛 조각 SVG */}
      <svg
        aria-hidden
        viewBox="0 0 380 150"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          {/* 타이틀 뒤 다크 비네팅 (달빛과 글씨 대비 강조) */}
          <radialGradient id="mysticVignette" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#090418" stopOpacity="0.72" />
            <stop offset="65%" stopColor="#12082c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#140a2e" stopOpacity="0" />
          </radialGradient>

          {/* 보름달 그라데이션 */}
          <radialGradient id="fullMoonGrad" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#e8eef7" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#9aa8bf" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#4f5d75" stopOpacity="0.12" />
          </radialGradient>

          {/* 소용돌이 링 그라데이션 */}
          <linearGradient id="swirlGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="45%" stopColor="#cbe5ff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#7cb8ff" stopOpacity="0.04" />
          </linearGradient>

          {/* 은빛~푸른 달빛 텍스트/장식 그라데이션 */}
          <linearGradient id="moonlightMetal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#eef7ff" />
            <stop offset="78%" stopColor="#a8d4ff" />
            <stop offset="100%" stopColor="#6ea8eb" />
          </linearGradient>

          {/* 십자 별빛 플레어 그라데이션 */}
          <radialGradient id="flareGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#cce8ff" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#7cb8ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 은은한 다크 오라 */}
        <ellipse cx="190" cy="75" rx="185" ry="72" fill="url(#mysticVignette)" />

        {/* 우측 상단 신비로운 보름달 */}
        <g transform="translate(278, 48)">
          <circle cx="0" cy="0" r="38" fill="url(#fullMoonGrad)" />
          {/* 달 표면 크레이터 음영 */}
          <circle cx="-10" cy="-8" r="9" fill="#5e6b82" opacity="0.18" />
          <circle cx="12" cy="6" r="12" fill="#5e6b82" opacity="0.15" />
          <circle cx="4" cy="-16" r="6" fill="#5e6b82" opacity="0.14" />
          <circle cx="-14" cy="14" r="7" fill="#5e6b82" opacity="0.14" />
        </g>

        {/* 중앙 소용돌이 아우라 (Swirling Mist Rings) */}
        <g fill="none" stroke="url(#swirlGrad)" strokeLinecap="round">
          <path d="M95,92 C68,52 122,12 195,18 C258,23 292,66 256,108 C222,144 136,142 108,104" strokeWidth="5" opacity="0.55" />
          <path d="M112,108 C82,66 135,24 204,28 C262,32 280,82 238,118 C196,150 128,136 112,108" strokeWidth="2" opacity="0.7" />
          <path d="M78,76 C115,62 248,54 306,82" strokeWidth="1.4" opacity="0.45" />
        </g>

        {/* 타이틀 글자 아래 장식 스워시 곡선 (첨부 이미지의 흐르는 세리프 꼬리) */}
        <g fill="none" stroke="url(#moonlightMetal)" strokeLinecap="round">
          <path d="M58,68 Q118,62 162,71 T254,67" strokeWidth="1.5" opacity="0.82" />
          <path d="M84,122 Q152,115 208,125 T302,118" strokeWidth="1.5" opacity="0.82" />
        </g>

        {/* 흩날리는 마법 빛 조각 (Sparkle Shards) */}
        <g fill="#e8f4ff">
          <polygon points="62,32 66,35 63,40 59,36" opacity="0.85" />
          <polygon points="218,14 223,18 219,23 214,19" opacity="0.9" />
          <polygon points="312,96 316,99 313,103 309,100" opacity="0.75" />
          <polygon points="74,106 78,109 75,113 71,110" opacity="0.8" />
          <polygon points="282,124 286,127 283,131 279,128" opacity="0.85" />
          <circle cx="136" cy="22" r="1.4" opacity="0.8" />
          <circle cx="248" cy="36" r="1.3" opacity="0.7" />
          <circle cx="102" cy="84" r="1.5" opacity="0.85" />
          <circle cx="296" cy="64" r="1.3" opacity="0.75" />
        </g>

        {/* 십자 별빛 플레어 (✦ Starburst Flares) */}
        {/* 1) 상단 우측 별빛 플레어 */}
        <g transform="translate(226, 26)">
          <circle cx="0" cy="0" r="11" fill="url(#flareGlow)" />
          <path d="M-14,0 L14,0 M0,-14 L0,14 M-5,-5 L5,5 M-5,5 L5,-5" stroke="#ffffff" strokeWidth="1.1" />
          <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
        </g>
        {/* 2) 하단 좌측 별빛 플레어 */}
        <g transform="translate(88, 98)">
          <circle cx="0" cy="0" r="12" fill="url(#flareGlow)" />
          <path d="M-15,0 L15,0 M0,-15 L0,15 M-5,-5 L5,5 M-5,5 L5,-5" stroke="#ffffff" strokeWidth="1.15" />
          <circle cx="0" cy="0" r="2.4" fill="#ffffff" />
        </g>
        {/* 3) 하단 우측 작은 플레어 */}
        <g transform="translate(292, 108) scale(0.75)">
          <circle cx="0" cy="0" r="10" fill="url(#flareGlow)" />
          <path d="M-12,0 L12,0 M0,-12 L0,12" stroke="#ffffff" strokeWidth="1.1" />
          <circle cx="0" cy="0" r="2" fill="#ffffff" />
        </g>

        {/* 글자 위 작은 푸른 보석 물방울 포인트 (레퍼런스의 푸른 물방울 오너먼트) */}
        <g transform="translate(88, 41)">
          <path d="M0,-4 C2.5,-1 3,2 0,4 C-3,2 -2.5,-1 0,-4 Z" fill="#5bb2ff" stroke="#e3f3ff" strokeWidth="0.6" />
        </g>
        <g transform="translate(206, 86)">
          <path d="M0,-4 C2.5,-1 3,2 0,4 C-3,2 -2.5,-1 0,-4 Z" fill="#5bb2ff" stroke="#e3f3ff" strokeWidth="0.6" />
        </g>
      </svg>

      {/* 메인 2단 세리프 타이틀 */}
      <h1
        aria-label="오늘의 업무 운세"
        className="mystic-serif relative z-10 flex flex-col items-center text-center leading-[1.15]"
      >
        <span className="mystic-title-line text-[34px] font-black tracking-[0.06em] sm:text-[38px]">
          오늘의
        </span>
        <span className="mystic-title-line mt-0.5 text-[42px] font-black tracking-[0.05em] sm:text-[46px]">
          업무 운세
        </span>
      </h1>
    </motion.div>
  );
}
