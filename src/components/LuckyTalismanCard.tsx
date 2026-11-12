"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Owl from "./Owl";
import { track } from "@/lib/analytics";

export interface CardTheme {
  bgGrad: string;
  pillBg: string;
  emblemColor: string;
  sheetBg: string;
  sheetText: string;
  buttonBg: string;
}

export const CARD_THEMES: Record<string, CardTheme> = {
  coral: {
    bgGrad: "linear-gradient(180deg, #f3956e 0%, #e46043 52%, #c93323 100%)",
    pillBg: "rgba(116, 22, 16, 0.72)",
    emblemColor: "#e4573d",
    sheetBg: "linear-gradient(180deg, #ecd8d5 0%, #e5ccc8 100%)",
    sheetText: "#8e2420",
    buttonBg: "#9b2722",
  },
  violet: {
    bgGrad: "linear-gradient(180deg, #9b7bf7 0%, #6d47d9 52%, #4723a6 100%)",
    pillBg: "rgba(38, 15, 98, 0.72)",
    emblemColor: "#7c4dff",
    sheetBg: "linear-gradient(180deg, #e2dcf2 0%, #d5cceb 100%)",
    sheetText: "#3d1e8d",
    buttonBg: "#4c26ab",
  },
  emerald: {
    bgGrad: "linear-gradient(180deg, #62cfa5 0%, #2ea37b 52%, #187556 100%)",
    pillBg: "rgba(11, 68, 49, 0.72)",
    emblemColor: "#289c74",
    sheetBg: "linear-gradient(180deg, #d7ece4 0%, #c8e3d9 100%)",
    sheetText: "#165c44",
    buttonBg: "#1b6e52",
  },
  amber: {
    bgGrad: "linear-gradient(180deg, #f5b95f 0%, #e28734 52%, #c2571a 100%)",
    pillBg: "rgba(108, 42, 9, 0.72)",
    emblemColor: "#dd7c2b",
    sheetBg: "linear-gradient(180deg, #efe1d1 0%, #e6d3be 100%)",
    sheetText: "#873c12",
    buttonBg: "#994415",
  },
  rose: {
    bgGrad: "linear-gradient(180deg, #f28ca3 0%, #dc5174 52%, #b5274e 100%)",
    pillBg: "rgba(99, 16, 40, 0.72)",
    emblemColor: "#d6486c",
    sheetBg: "linear-gradient(180deg, #eed9df 0%, #e5c8d1 100%)",
    sheetText: "#881d3b",
    buttonBg: "#9b2244",
  },
};

/** 운세 ID별 레퍼런스 스타일 2줄 기원 문구 & 카드 컬러 테마 */
export function getFortuneCardMeta(fortuneId: string): {
  line1: string;
  line2: string;
  themeKey: keyof typeof CARD_THEMES;
  emblemType: "flame" | "clover" | "star" | "bolt";
} {
  switch (fortuneId) {
    case "presentation-king":
      return { line1: "말발의 기운", line2: "시원하게 터지소서", themeKey: "coral", emblemType: "flame" };
    case "approval-smooth":
      return { line1: "결재의 기운", line2: "단번에 통과하소서", themeKey: "emerald", emblemType: "clover" };
    case "idea-planner":
      return { line1: "영감의 기운", line2: "반짝이게 샘솟으소서", themeKey: "violet", emblemType: "star" };
    case "smart-growth":
      return { line1: "성장의 기운", line2: "거침없이 오르소서", themeKey: "amber", emblemType: "bolt" };
    case "teamwork-synergy":
      return { line1: "호흡의 기운", line2: "찰떡같이 맞으소서", themeKey: "rose", emblemType: "clover" };
    case "focus-master":
      return { line1: "몰입의 기운", line2: "단숨에 끝내소서", themeKey: "violet", emblemType: "bolt" };
    case "early-leave-fairy":
      return { line1: "칼퇴의 기운", line2: "가볍게 퇴근하소서", themeKey: "emerald", emblemType: "clover" };
    case "communication-pro":
      return { line1: "소통의 기운", line2: "물 흐르듯 풀리소서", themeKey: "coral", emblemType: "star" };
    case "double-check":
      return { line1: "철벽의 기운", line2: "빈틈없이 지키소서", themeKey: "amber", emblemType: "star" };
    case "recharge-day":
      return { line1: "평온의 기운", line2: "여유롭게 채우소서", themeKey: "emerald", emblemType: "clover" };
    case "coffee-monday":
      return { line1: "활력의 기운", line2: "상쾌하게 깨어나소서", themeKey: "amber", emblemType: "bolt" };
    case "hidden-mvp":
    default:
      return { line1: "대박의 기운", line2: "활활 타오르소서", themeKey: "coral", emblemType: "flame" };
  }
}

interface LuckyCardProps {
  badgeText?: string;
  owlSrc: string;
  line1: string;
  line2: string;
  subText?: string;
  themeKey?: keyof typeof CARD_THEMES;
  emblemType?: "flame" | "clover" | "star" | "bolt";
  onClickOwl?: () => void;
  compact?: boolean;
}

/**
 * 첨부해주신 레퍼런스(토스 행운 카드) 형식의 미니멀 입체 행운 카드:
 * - 상단 다크 틴트 캡슐 배지 ('행운 카드' / '행운 부적')
 * - 중앙 3D 입체 링 아크(Ring Arc) + 3D 부엉이 + 가슴 중앙 글로우 엠블럼
 * - 하단 굵고 직관적인 2줄 기원 카피 ("불의 기운 / 활활 타오르소서" 형식)
 * - 최하단 심플 브랜드 마크
 */
export function LuckyTalismanCard({
  badgeText = "행운 카드",
  owlSrc,
  line1,
  line2,
  subText,
  themeKey = "coral",
  emblemType = "flame",
  onClickOwl,
  compact = false,
}: LuckyCardProps) {
  const theme = CARD_THEMES[themeKey] ?? CARD_THEMES.coral;
  const uid = `${themeKey}-${emblemType}`;

  return (
    <div
      style={{
        background: theme.bgGrad,
        boxShadow: "0 22px 48px -12px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
      }}
      className={`relative mx-auto flex w-full select-none flex-col items-center justify-between overflow-hidden rounded-[34px] text-center text-white ${
        compact ? "max-w-[300px] px-6 py-6" : "max-w-[325px] px-7 py-8"
      }`}
    >
      {/* 상단 은은한 하이라이트 광원 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full opacity-30 blur-2xl"
        style={{ background: "#ffffff" }}
      />

      {/* 1. 상단 캡슐 배지 */}
      <div
        style={{ background: theme.pillBg }}
        className="relative z-10 rounded-full px-5 py-1.5 text-[13px] font-bold tracking-tight text-white/95 shadow-sm"
      >
        {badgeText}
      </div>

      {/* 2. 중앙 3D 링 아크 + 부엉이 + 중앙 원형 엠블럼 */}
      <div
        onClick={onClickOwl}
        className={`relative my-4 flex items-center justify-center ${onClickOwl ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
        style={{ width: compact ? 186 : 210, height: compact ? 186 : 210 }}
      >
        {/* 레퍼런스처럼 캐릭터를 감싸는 입체 화이트 3D 오픈 링 (끝부분이 둥글게 끊어진 호) */}
        <svg
          viewBox="0 0 220 220"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={`ringGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <filter id={`ringShadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.22" />
            </filter>
          </defs>
          {/* 약 300도 회전하는 두꺼운 3D 라운드 아크 */}
          <path
            d="M 72 184 A 82 82 0 1 1 188 134"
            fill="none"
            stroke={`url(#ringGrad-${uid})`}
            strokeWidth="12"
            strokeLinecap="round"
            filter={`url(#ringShadow-${uid})`}
          />
        </svg>

        {/* 중앙 3D 부엉이 */}
        <div className="relative z-10 translate-y-1">
          <Owl src={owlSrc} alt={line1} size={compact ? 142 : 162} priority />
        </div>

        {/* 부엉이 가슴 중앙에서 빛나는 원형 기운 엠블럼 (레퍼런스의 불꽃 원형 배지 역할) */}
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.95),0_4px_10px_rgba(0,0,0,0.2)]"
          style={{ color: theme.emblemColor }}
        >
          {emblemType === "flame" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0 0 10 0c0-2-1-4-2.5-5.5-.3 1.5-1.2 2.5-2.5 2.5-1.5 0-2.5-1.5-2-3.5C10.5 4.8 12 2 12 2Z" />
            </svg>
          )}
          {emblemType === "clover" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 11C9.5 6.5 5 8 6.5 11.5C3 10 1.5 14.5 6 15.5C3.5 19 8 21.5 10.5 17C11 19.5 11 21 12 22C13 21 13 19.5 13.5 17C16 21.5 20.5 19 18 15.5C22.5 14.5 21 10 17.5 11.5C19 8 14.5 6.5 12 11Z" />
            </svg>
          )}
          {emblemType === "star" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.5L14.6 9.4L21.5 12L14.6 14.6L12 21.5L9.4 14.6L2.5 12L9.4 9.4L12 2.5Z" />
            </svg>
          )}
          {emblemType === "bolt" && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
            </svg>
          )}
        </div>
      </div>

      {/* 3. 하단 2줄 기원 카피 */}
      <div className="relative z-10 mt-1">
        <p className="text-[23px] font-extrabold leading-[1.28] tracking-tight text-white drop-shadow-sm">
          {line1}
          <br />
          {line2}
        </p>
        {subText && (
          <p className="mt-2 text-[12.5px] font-medium text-white/80">
            {subText}
          </p>
        )}
      </div>

      {/* 4. 최하단 미니멀 브랜드 로고 */}
      <div className="relative z-10 mt-5 flex items-center gap-1.5 opacity-80">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3C7.5 3 4 6.5 4 11c0 3.2 1.8 6 4.5 7.3L12 21l3.5-2.7C18.2 17 20 14.2 20 11c0-4.5-3.5-8-8-8Zm-2.5 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
        </svg>
        <span className="text-[13px] font-bold tracking-tight">오늘의 업무 운세</span>
      </div>
    </div>
  );
}

/**
 * 내 행운 카드 전체화면 프리뷰 & 이미지 저장 시트 (첨부 레퍼런스와 동일한 구성)
 */
export function MyLuckyCardModal({
  name,
  fortuneId,
  fortuneTitle,
  owlSrc,
  onClose,
  onToast,
}: {
  name: string;
  fortuneId: string;
  fortuneTitle: string;
  owlSrc: string;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const meta = getFortuneCardMeta(fortuneId);
  const theme = CARD_THEMES[meta.themeKey] ?? CARD_THEMES.coral;

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const handleDownload = async () => {
    if (saving || !captureRef.current) return;
    setSaving(true);
    track("image_save", { fortune: fortuneId, format: "toss_lucky_card" });
    try {
      const { toPng } = await import("html-to-image");
      const opts = { pixelRatio: 2.5, cacheBust: true };
      let dataUrl: string;
      try {
        dataUrl = await toPng(captureRef.current, opts);
      } catch {
        dataUrl = await toPng(captureRef.current, { ...opts, skipFonts: true });
      }
      const ua = navigator.userAgent;
      if (/KAKAOTALK|iPhone|iPad|iPod/i.test(ua)) {
        setPreviewUrl(dataUrl);
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `오늘의행운카드-${name}.png`;
        a.click();
        onToast("행운 카드를 이미지로 저장했어요");
      }
    } catch {
      onToast("저장에 실패했어요. 화면을 캡처해 주세요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        style={{ background: theme.sheetBg }}
        className="relative flex max-h-[92dvh] w-full max-w-[400px] flex-col items-center overflow-y-auto rounded-[36px] px-6 py-7 shadow-2xl"
      >
        {/* 상단 뒤로/닫기 바 */}
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="뒤로 가기"
            style={{ color: theme.sheetText }}
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span style={{ color: theme.sheetText }} className="text-xs font-semibold opacity-70">
            행운 카드 저장
          </span>
          <div className="w-9" />
        </div>

        {/* 캡처될 영역 (상단 문구 + 중앙 카드) */}
        <div
          ref={captureRef}
          style={{ background: theme.sheetBg }}
          className="flex w-full flex-col items-center px-3 py-5"
        >
          <p
            style={{ color: theme.sheetText }}
            className="mb-5 text-center text-[16px] font-bold leading-snug tracking-tight"
          >
            {month}월 {day}일 {name}님에게
            <br />
            행운의 기운을 전해드려요
          </p>

          <LuckyTalismanCard
            badgeText="행운 카드"
            owlSrc={owlSrc}
            line1={meta.line1}
            line2={meta.line2}
            subText={fortuneTitle}
            themeKey={meta.themeKey}
            emblemType={meta.emblemType}
          />
        </div>

        {/* 하단 캡슐형 이미지 저장 버튼 (레퍼런스와 동일한 위치·스타일) */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={saving}
          style={{ background: theme.buttonBg }}
          className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{saving ? "저장 중…" : "이미지 저장"}</span>
        </button>

        {previewUrl && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-5 text-white">
            <p className="mb-3 text-center text-sm">이미지를 길게 눌러 저장해 주세요</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="저장할 행운 카드" className="max-h-[68dvh] rounded-3xl" />
            <button
              onClick={() => setPreviewUrl(null)}
              className="mt-4 h-11 rounded-full bg-white px-8 text-sm font-bold text-night-800"
            >
              닫기
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
