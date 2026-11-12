"use client";

import { motion } from "framer-motion";

/**
 * 로맨스 판타지 / 웹소설 표지 타이포그래피 스타일의 타이틀 로고.
 * - 가늘고 유려한 명조·세리프(Light 300 웨이트) + 세로로 살짝 길고 날렵한 비율
 * - 은백색~달빛 아이스블루 그라데이션과 섬세한 실버 림라이트(외곽선)
 * - 글자 획에서 자연스럽게 뻗어나가는 아주 가는 스워시(곡선 꼬리)와 십자 별빛 플레어(✦)
 * - 배경의 몽환적인 보름달과 가느다란 달빛 아우라 링
 */
export default function MysticTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto flex w-full max-w-[360px] flex-col items-center justify-center py-1 select-none"
    >
      <h1 className="sr-only">오늘의 업무 운세</h1>

      <svg
        aria-hidden
        viewBox="0 0 380 148"
        className="w-full overflow-visible"
      >
        <defs>
          {/* 타이틀 뒤 은은한 다크 오라 */}
          <radialGradient id="wnVignette" cx="50%" cy="50%" r="54%">
            <stop offset="0%" stopColor="#080316" stopOpacity="0.68" />
            <stop offset="65%" stopColor="#12072b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#140a2e" stopOpacity="0" />
          </radialGradient>

          {/* 은은한 보름달 */}
          <radialGradient id="wnMoon" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#eef4fc" stopOpacity="0.48" />
            <stop offset="55%" stopColor="#9aa9c4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#495773" stopOpacity="0.08" />
          </radialGradient>

          {/* 가느다란 소용돌이 달빛 결 */}
          <linearGradient id="wnSwirl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="48%" stopColor="#d9edff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#7cb8ff" stopOpacity="0" />
          </linearGradient>

          {/* 웹소설 은백~창백한 달빛 블루 텍스트 그라데이션 */}
          <linearGradient id="wnTextGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="38%" stopColor="#f5faff" />
            <stop offset="72%" stopColor="#badcff" />
            <stop offset="100%" stopColor="#7fb4f0" />
          </linearGradient>

          {/* 스워시 곡선용 페이드 그라데이션 */}
          <linearGradient id="wnSwashGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8fc5ff" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.88" />
            <stop offset="70%" stopColor="#bfe0ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#8fc5ff" stopOpacity="0.05" />
          </linearGradient>

          {/* 십자 별빛 광채 */}
          <radialGradient id="wnFlare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#d4ebff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7cb8ff" stopOpacity="0" />
          </radialGradient>

          {/* 웹소설 타이틀 전용 섬세한 그림자 + 달빛 글로우 필터 */}
          <filter id="wnGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#050112" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#7ab8ff" floodOpacity="0.38" />
          </filter>
        </defs>

        {/* 배경 비네팅 */}
        <ellipse cx="190" cy="74" rx="180" ry="68" fill="url(#wnVignette)" />

        {/* 우측 상단 몽환적인 보름달 */}
        <g transform="translate(274, 46)">
          <circle cx="0" cy="0" r="34" fill="url(#wnMoon)" />
          <circle cx="-9" cy="-7" r="7.5" fill="#52607a" opacity="0.16" />
          <circle cx="10" cy="5" r="10" fill="#52607a" opacity="0.13" />
          <circle cx="3" cy="-14" r="5" fill="#52607a" opacity="0.12" />
        </g>

        {/* 중앙을 감싸는 가늘고 섬세한 달빛 궤도 & 안개 결 */}
        <g fill="none" stroke="url(#wnSwirl)" strokeLinecap="round">
          <path d="M98,94 C72,54 124,14 194,18 C254,22 284,64 250,104 C218,138 138,136 110,102" strokeWidth="2.4" opacity="0.65" />
          <path d="M114,106 C88,66 138,24 202,28 C256,31 272,78 234,114 C194,144 130,132 114,106" strokeWidth="1" opacity="0.85" />
          <path d="M62,76 Q190,56 318,80" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* 상단 미니 데코 (가느다란 다이아몬드 라인) */}
        <g opacity="0.78">
          <line x1="138" y1="16" x2="178" y2="16" stroke="url(#wnSwashGrad)" strokeWidth="0.6" />
          <polygon points="190,12 193,16 190,20 187,16" fill="#e6f3ff" />
          <line x1="202" y1="16" x2="242" y2="16" stroke="url(#wnSwashGrad)" strokeWidth="0.6" />
        </g>

        {/* 1행: "오늘의" - 얇고 날렵한 웹소설 명조 (세로 장평 1.12배로 우아하게) */}
        <g filter="url(#wnGlow)" transform="translate(190, 58) scale(0.94, 1.12)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="url(#wnTextGrad)"
            stroke="#ffffff"
            strokeWidth="0.3"
            strokeOpacity="0.65"
            className="webnovel-serif"
            style={{
              fontSize: "34px",
              fontWeight: 300,
              letterSpacing: "0.18em",
            }}
          >
            오늘의
          </text>
        </g>

        {/* 2행: "업무 운세" - 얇고 유려한 웹소설 표지 메인 타이포 */}
        <g filter="url(#wnGlow)" transform="translate(190, 108) scale(0.93, 1.15)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="url(#wnTextGrad)"
            stroke="#ffffff"
            strokeWidth="0.35"
            strokeOpacity="0.7"
            className="webnovel-serif"
            style={{
              fontSize: "43px",
              fontWeight: 300,
              letterSpacing: "0.13em",
            }}
          >
            업무 운세
          </text>
        </g>

        {/* 웹소설 특유의 가늘게 뻗어나가는 세리프 스워시(Swash) 곡선 */}
        <g fill="none" stroke="url(#wnSwashGrad)" strokeLinecap="round">
          {/* 1행 아래 가느다란 유선형 꼬리 */}
          <path d="M108,65 C142,61 178,68 232,62 C252,60 266,56 276,51" strokeWidth="0.85" />
          {/* 2행 아래 길고 우아한 세리프 언더라인 스워시 */}
          <path d="M72,118 C118,111 168,122 238,116 C272,113 296,107 312,99" strokeWidth="0.95" />
          <path d="M112,123 C165,126 225,121 278,116" strokeWidth="0.5" opacity="0.65" />
        </g>

        {/* 글자 안 작은 푸른 눈물/보석 디테일 (레퍼런스의 푸른 물방울 포인트) */}
        <g transform="translate(141, 41) scale(0.85)">
          <path d="M0,-3.5 C2,-1 2.4,1.8 0,3.5 C-2.4,1.8 -2,-1 0,-3.5 Z" fill="#63b8ff" stroke="#e8f5ff" strokeWidth="0.5" />
        </g>
        <g transform="translate(216, 86) scale(0.9)">
          <path d="M0,-3.5 C2,-1 2.4,1.8 0,3.5 C-2.4,1.8 -2,-1 0,-3.5 Z" fill="#63b8ff" stroke="#e8f5ff" strokeWidth="0.5" />
        </g>

        {/* 흩날리는 미세 다이아몬드 별가루 */}
        <g fill="#e8f4ff">
          <polygon points="74,36 77,38 75,42 72,39" opacity="0.78" />
          <polygon points="298,94 301,96 299,100 296,97" opacity="0.75" />
          <polygon points="88,108 91,110 89,114 86,111" opacity="0.7" />
          <circle cx="122" cy="28" r="1.1" opacity="0.75" />
          <circle cx="256" cy="30" r="1.1" opacity="0.7" />
          <circle cx="96" cy="78" r="1.2" opacity="0.8" />
          <circle cx="288" cy="70" r="1.1" opacity="0.75" />
        </g>

        {/* 가늘고 예리한 십자 스타 플레어 (✦) */}
        {/* 1) '의' 상단 별빛 */}
        <g transform="translate(236, 32)">
          <circle cx="0" cy="0" r="9" fill="url(#wnFlare)" />
          <path d="M-13,0 L13,0 M0,-13 L0,13 M-3.5,-3.5 L3.5,3.5 M-3.5,3.5 L3.5,-3.5" stroke="#ffffff" strokeWidth="0.75" />
          <circle cx="0" cy="0" r="1.6" fill="#ffffff" />
        </g>
        {/* 2) '업' 좌측 하단 별빛 */}
        <g transform="translate(96, 102)">
          <circle cx="0" cy="0" r="10" fill="url(#wnFlare)" />
          <path d="M-14,0 L14,0 M0,-14 L0,14 M-4,-4 L4,4 M-4,4 L4,-4" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="1.8" fill="#ffffff" />
        </g>
        {/* 3) '세' 우측 스워시 끝 별빛 */}
        <g transform="translate(286, 106) scale(0.75)">
          <circle cx="0" cy="0" r="9" fill="url(#wnFlare)" />
          <path d="M-11,0 L11,0 M0,-11 L0,11" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>
      </svg>
    </motion.div>
  );
}
