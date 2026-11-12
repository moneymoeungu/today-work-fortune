"use client";

import { motion } from "framer-motion";

/**
 * 첨부 레퍼런스 이미지 스타일 타이틀:
 * - 상단 소제목: '재미로 보는'
 * - 하단 메인 타이틀: '오늘의 업무 운세'
 * - 세로획은 묵직하고 가로획과 삐침(세리프)·물방울 맺힘이 살아있는 고대비 헤비 명조체 (부크크명조 Bold / 송명)
 * - 순백색(#FFFFFF) 텍스트에 연보라·핑크빛이 감도는 부드러운 네온 글로우 효과 및 좌상단 8각 별빛 심볼
 */
export default function MysticTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative mx-auto flex w-full max-w-[375px] flex-col items-center justify-center py-2 select-none"
    >
      <h1 className="sr-only">재미로 보는 오늘의 업무 운세</h1>

      {/* 타이틀 뒤 은은한 보라·라벤더 후광 (레퍼런스의 포근한 퍼플 글로우) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-1/2 h-28 -translate-y-1/2 rounded-full opacity-45 blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 121, 249, 0.42) 0%, rgba(168, 85, 247, 0.25) 55%, transparent 80%)",
        }}
      />

      {/* 좌측 상단 레퍼런스 스타일 8각 선형 별빛 (✳) */}
      <svg
        aria-hidden
        viewBox="0 0 36 36"
        className="pointer-events-none absolute left-3 top-0.5 h-7 w-7 text-white/90 drop-shadow-[0_0_6px_rgba(245,208,254,0.8)]"
      >
        <g stroke="currentColor" strokeLinecap="round">
          {/* 상하좌우 긴 광선 */}
          <line x1="18" y1="3" x2="18" y2="13.5" strokeWidth="1.5" />
          <line x1="18" y1="22.5" x2="18" y2="33" strokeWidth="1.5" />
          <line x1="3" y1="18" x2="13.5" y2="18" strokeWidth="1.5" />
          <line x1="22.5" y1="18" x2="33" y2="18" strokeWidth="1.5" />
          {/* 대각선 짧은 광선 */}
          <line x1="8.5" y1="8.5" x2="14.5" y2="14.5" strokeWidth="1.4" />
          <line x1="21.5" y1="21.5" x2="27.5" y2="27.5" strokeWidth="1.4" />
          <line x1="27.5" y1="8.5" x2="21.5" y2="14.5" strokeWidth="1.4" />
          <line x1="14.5" y1="21.5" x2="8.5" y2="27.5" strokeWidth="1.4" />
          {/* 중앙 작은 링 */}
          <circle cx="18" cy="18" r="2.6" fill="none" strokeWidth="1.5" />
        </g>
      </svg>

      {/* 우측 하단 작은 보조 반짝이 */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -bottom-1 right-3 h-4 w-4 text-purple-100/75 drop-shadow-[0_0_5px_rgba(245,208,254,0.7)]"
      >
        <path
          d="M12 2v20M2 12h20M5.5 5.5l13 13M18.5 5.5l-13 13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* 1행: '재미로 보는' */}
      <p
        className="fortune-heavy-serif relative z-10 text-[20px] leading-tight tracking-[-0.03em] text-white"
        style={{
          WebkitTextStroke: "0.35px #ffffff",
          textShadow:
            "0 0 10px rgba(255, 255, 255, 0.55), 0 0 22px rgba(232, 121, 249, 0.55), 0 2px 6px rgba(20, 10, 46, 0.45)",
        }}
      >
        재미로 보는
      </p>

      {/* 2행: '오늘의 업무 운세' */}
      <p
        className="fortune-heavy-serif relative z-10 mt-1.5 whitespace-nowrap text-[38px] leading-[1.12] tracking-[-0.04em] text-white sm:text-[42px]"
        style={{
          WebkitTextStroke: "0.7px #ffffff",
          textShadow:
            "0 0 12px rgba(255, 255, 255, 0.65), 0 0 28px rgba(232, 121, 249, 0.65), 0 0 46px rgba(192, 132, 252, 0.45), 0 3px 8px rgba(20, 10, 46, 0.5)",
        }}
      >
        오늘의 업무 운세
      </p>
    </motion.div>
  );
}
