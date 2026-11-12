"use client";

import { motion } from "framer-motion";

/**
 * 레퍼런스(『어느 깊은 밤 길을 잃어도』) 스타일의 로맨스 판타지 웹소설 표지 타이틀:
 * - 가로획은 면도날처럼 가늘고 세로획·삐침(세리프)은 삼각형으로 날카롭게 살아있는 고대비 명조(부크크명조 Light / 을유1945)
 * - 자간을 웹소설 표지처럼 쫀쫀하게 밀착하고 세로 장평을 살짝 높여 우아한 타이틀 조형미 연출
 * - 글자의 'ㅇ' 내공에 박힌 푸른 물방울 보석, 세로 기둥의 고딕 스텐실 장식, 획 끝에서 뻗어나가는 은빛 캘리그라피 스워시와 십자 별빛 플레어
 */
export default function MysticTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto flex w-full max-w-[365px] flex-col items-center justify-center py-1 select-none"
    >
      <h1 className="sr-only">오늘의 업무 운세</h1>

      <svg
        aria-hidden
        viewBox="0 0 380 154"
        className="w-full overflow-visible"
      >
        <defs>
          {/* 타이틀 뒤 짙은 밤하늘 비네팅 (얇은 세리프 획의 대비를 극대화) */}
          <radialGradient id="wnVignette" cx="50%" cy="50%" r="54%">
            <stop offset="0%" stopColor="#060212" stopOpacity="0.82" />
            <stop offset="62%" stopColor="#100626" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#140a2e" stopOpacity="0" />
          </radialGradient>

          {/* 우측 상단 창백한 보름달 */}
          <radialGradient id="wnMoon" cx="38%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#eef5ff" stopOpacity="0.52" />
            <stop offset="55%" stopColor="#94a6c4" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#3e4c69" stopOpacity="0.08" />
          </radialGradient>

          {/* 소용돌이치는 달빛 바람 궤도 */}
          <linearGradient id="wnSwirl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="45%" stopColor="#d8eeff" stopOpacity="0.46" />
            <stop offset="75%" stopColor="#8dc6ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#7cb8ff" stopOpacity="0" />
          </linearGradient>

          {/* 웹소설 특유의 순백~아이스블루 메탈릭 세리프 그라데이션 */}
          <linearGradient id="wnTextGradTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f2f9ff" />
            <stop offset="78%" stopColor="#b5dcff" />
            <stop offset="100%" stopColor="#7cb3f2" />
          </linearGradient>

          <linearGradient id="wnTextGradBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#f5faff" />
            <stop offset="75%" stopColor="#b2daff" />
            <stop offset="100%" stopColor="#76aeee" />
          </linearGradient>

          {/* 글자 획에서 이어지는 날렵한 스워시 그라데이션 */}
          <linearGradient id="wnSwashGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9ed0ff" stopOpacity="0.08" />
            <stop offset="22%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="68%" stopColor="#bce0ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8fc5ff" stopOpacity="0" />
          </linearGradient>

          {/* 십자 별빛 플레어 광채 */}
          <radialGradient id="wnFlare" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="32%" stopColor="#d4ebff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7cb8ff" stopOpacity="0" />
          </radialGradient>

          {/* 세리프 삐침을 또렷하게 살려주는 정교한 림라이트 + 딥 섀도우 필터 */}
          <filter id="wnCrispGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="1.8" stdDeviation="1.4" floodColor="#03010a" floodOpacity="0.95" />
            <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#72b4ff" floodOpacity="0.42" />
          </filter>
        </defs>

        {/* 배경 다크 오라 비네팅 */}
        <ellipse cx="190" cy="78" rx="178" ry="68" fill="url(#wnVignette)" />

        {/* 우측 상단 몽환적인 보름달 */}
        <g transform="translate(278, 48)">
          <circle cx="0" cy="0" r="36" fill="url(#wnMoon)" />
          <circle cx="-10" cy="-7" r="8" fill="#475670" opacity="0.18" />
          <circle cx="11" cy="6" r="10.5" fill="#475670" opacity="0.14" />
          <circle cx="3" cy="-15" r="5.5" fill="#475670" opacity="0.14" />
        </g>

        {/* 배경을 감싸는 달빛 소용돌이 궤도 (레퍼런스의 원형 바람 결) */}
        <g fill="none" stroke="url(#wnSwirl)" strokeLinecap="round">
          <path d="M96,98 C66,52 122,12 194,16 C258,20 288,66 252,108 C216,144 134,140 106,104" strokeWidth="2.6" opacity="0.7" />
          <path d="M114,110 C84,66 136,22 204,26 C260,30 276,80 236,118 C194,148 128,136 114,110" strokeWidth="1.1" opacity="0.9" />
          <path d="M132,34 C174,18 232,28 254,64" strokeWidth="0.75" opacity="0.65" />
        </g>

        {/* 1행: "오늘의" - 쫀쫀한 자간과 날카로운 세리프 대비 */}
        <g filter="url(#wnCrispGlow)" transform="translate(190, 62) scale(0.95, 1.15)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="url(#wnTextGradTop)"
            stroke="#e8f4ff"
            strokeWidth="0.22"
            strokeOpacity="0.75"
            className="webnovel-serif"
            style={{
              fontSize: "40px",
              fontWeight: 300,
              letterSpacing: "0.04em",
            }}
          >
            오늘의
          </text>
        </g>

        {/* 2행: "업무 운세" - 웹소설 메인 타이틀 세리프 */}
        <g filter="url(#wnCrispGlow)" transform="translate(190, 114) scale(0.95, 1.18)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="url(#wnTextGradBottom)"
            stroke="#e8f4ff"
            strokeWidth="0.25"
            strokeOpacity="0.8"
            className="webnovel-serif"
            style={{
              fontSize: "46px",
              fontWeight: 300,
              letterSpacing: "0.03em",
            }}
          >
            업무 운세
          </text>
        </g>

        {/* 글자 획 끝에서 뻗어나가는 칼날 같은 세리프 스워시(Swash) 곡선 */}
        <g fill="none" stroke="url(#wnSwashGrad)" strokeLinecap="round">
          {/* 1행 '오·늘' 하단에서 우측으로 유려하게 흐르는 스워시 */}
          <path d="M124,66 C154,62 184,70 230,64 C248,61 262,57 272,51" strokeWidth="1.05" />
          {/* 2행 '업·무' 하단에서 길게 뻗어나가는 시그니처 세리프 꼬리 */}
          <path d="M88,121 C126,114 166,125 224,119 C258,116 286,109 304,100" strokeWidth="1.15" />
          <path d="M122,126 C168,129 220,124 272,118" strokeWidth="0.55" opacity="0.7" />
        </g>

        {/* 레퍼런스 타이포의 핵심 디테일: 글자 안 작은 사파이어 물방울 보석 */}
        <g transform="translate(143, 42) scale(0.88)">
          <path d="M0,-3.6 C2.1,-1 2.5,1.9 0,3.6 C-2.5,1.9 -2.1,-1 0,-3.6 Z" fill="#4daeff" stroke="#ffffff" strokeWidth="0.55" />
        </g>
        <g transform="translate(205, 88) scale(0.92)">
          <path d="M0,-3.6 C2.1,-1 2.5,1.9 0,3.6 C-2.5,1.9 -2.1,-1 0,-3.6 Z" fill="#4daeff" stroke="#ffffff" strokeWidth="0.55" />
        </g>

        {/* 흩날리는 은빛 꽃잎·다이아몬드 별가루 */}
        <g fill="#eef7ff">
          <polygon points="82,38 86,40 83,45 79,41" opacity="0.85" />
          <polygon points="292,96 296,98 293,103 289,99" opacity="0.8" />
          <polygon points="94,112 98,114 95,118 91,115" opacity="0.75" />
          <polygon points="244,22 247,24 245,28 242,25" opacity="0.7" />
          <circle cx="126" cy="26" r="1.1" opacity="0.8" />
          <circle cx="262" cy="32" r="1.1" opacity="0.75" />
          <circle cx="102" cy="76" r="1.2" opacity="0.85" />
          <circle cx="284" cy="72" r="1.1" opacity="0.8" />
        </g>

        {/* 세리프 모서리 끝에서 반짝이는 가늘고 예리한 십자 스타 플레어 (✦) */}
        {/* 1) '늘/의' 상단 세리프 끝 별빛 */}
        <g transform="translate(222, 30)">
          <circle cx="0" cy="0" r="10" fill="url(#wnFlare)" />
          <path d="M-15,0 L15,0 M0,-15 L0,15 M-3.5,-3.5 L3.5,3.5 M-3.5,3.5 L3.5,-3.5" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="1.7" fill="#ffffff" />
        </g>
        {/* 2) '업' 좌측 하단 세리프 모서리 별빛 */}
        <g transform="translate(103, 106)">
          <circle cx="0" cy="0" r="11" fill="url(#wnFlare)" />
          <path d="M-16,0 L16,0 M0,-16 L0,16 M-4,-4 L4,4 M-4,4 L4,-4" stroke="#ffffff" strokeWidth="0.85" />
          <circle cx="0" cy="0" r="1.9" fill="#ffffff" />
        </g>
        {/* 3) '세' 우측 세리프 끝 별빛 */}
        <g transform="translate(274, 108) scale(0.8)">
          <circle cx="0" cy="0" r="9" fill="url(#wnFlare)" />
          <path d="M-12,0 L12,0 M0,-12 L0,12" stroke="#ffffff" strokeWidth="0.85" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>
      </svg>
    </motion.div>
  );
}
