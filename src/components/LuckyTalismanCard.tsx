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

/**
 * 모든 12종 운세 카드와 선물 부적 카드에 동일하게 적용되는
 * 밤하늘 시그니처 로얄 벨벳 퍼플(Unified Royal Velvet Purple) 테마
 */
const UNIFIED_PURPLE_THEME: CardTheme = {
  bgGrad: "linear-gradient(180deg, #5c3da8 0%, #3b217d 54%, #231152 100%)",
  pillBg: "rgba(22, 9, 56, 0.65)",
  emblemColor: "#7c4dff",
  sheetBg: "linear-gradient(180deg, #251454 0%, #160b36 100%)",
  sheetText: "#f3e8ff",
  buttonBg: "#7c4dff",
};

export const CARD_THEMES: Record<string, CardTheme> = {
  violet: UNIFIED_PURPLE_THEME,
  indigo: UNIFIED_PURPLE_THEME,
  plum: UNIFIED_PURPLE_THEME,
  amethyst: UNIFIED_PURPLE_THEME,
};

/** 운세 ID별 레퍼런스 스타일 2줄 기원 문구 & 은은한 퍼플 카드 테마 */
export function getFortuneCardMeta(fortuneId: string): {
  line1: string;
  line2: string;
  themeKey: keyof typeof CARD_THEMES;
  emblemType: "flame" | "clover" | "star" | "bolt";
} {
  switch (fortuneId) {
    case "presentation-king":
      return { line1: "말발의 기운", line2: "시원하게 터지소서", themeKey: "plum", emblemType: "flame" };
    case "approval-smooth":
      return { line1: "결재의 기운", line2: "단번에 통과하소서", themeKey: "violet", emblemType: "clover" };
    case "idea-planner":
      return { line1: "영감의 기운", line2: "반짝이게 샘솟으소서", themeKey: "indigo", emblemType: "star" };
    case "smart-growth":
      return { line1: "성장의 기운", line2: "거침없이 오르소서", themeKey: "amethyst", emblemType: "bolt" };
    case "teamwork-synergy":
      return { line1: "호흡의 기운", line2: "찰떡같이 맞으소서", themeKey: "plum", emblemType: "clover" };
    case "focus-master":
      return { line1: "몰입의 기운", line2: "단숨에 끝내소서", themeKey: "indigo", emblemType: "bolt" };
    case "early-leave-fairy":
      return { line1: "칼퇴의 기운", line2: "가볍게 퇴근하소서", themeKey: "violet", emblemType: "clover" };
    case "communication-pro":
      return { line1: "소통의 기운", line2: "물 흐르듯 풀리소서", themeKey: "amethyst", emblemType: "star" };
    case "double-check":
      return { line1: "철벽의 기운", line2: "빈틈없이 지키소서", themeKey: "indigo", emblemType: "star" };
    case "recharge-day":
      return { line1: "평온의 기운", line2: "여유롭게 채우소서", themeKey: "violet", emblemType: "clover" };
    case "coffee-monday":
      return { line1: "활력의 기운", line2: "상쾌하게 깨어나소서", themeKey: "amethyst", emblemType: "bolt" };
    case "hidden-mvp":
    default:
      return { line1: "대박의 기운", line2: "활활 타오르소서", themeKey: "plum", emblemType: "flame" };
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
 * 첨부 레퍼런스(토스 행운 카드) 레이아웃에 맞춘 밤하늘 벨벳 퍼플 행운 카드
 */
export function LuckyTalismanCard({
  badgeText = "행운 카드",
  owlSrc,
  line1,
  line2,
  subText,
  themeKey = "violet",
  emblemType = "flame",
  onClickOwl,
  compact = false,
}: LuckyCardProps) {
  const theme = CARD_THEMES[themeKey] ?? CARD_THEMES.violet;
  const uid = `${themeKey}-${emblemType}`;

  return (
    <div
      style={{
        background: theme.bgGrad,
        border: "1px solid rgba(255, 255, 255, 0.16)",
        boxShadow:
          "0 20px 44px -12px rgba(8, 3, 24, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
      }}
      className={`relative mx-auto flex w-full select-none flex-col items-center justify-between overflow-hidden rounded-[34px] text-center text-white ${
        compact ? "max-w-[295px] px-6 py-6" : "max-w-[325px] px-7 py-7"
      }`}
    >
      {/* 상단 은은한 라벤더 광원 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full opacity-25 blur-2xl"
        style={{ background: "#d8b4fe" }}
      />

      {/* 1. 상단 캡슐 배지 */}
      <div
        style={{ background: theme.pillBg }}
        className="relative z-10 rounded-full border border-white/15 px-4 py-1.5 text-[12.5px] font-bold tracking-tight text-purple-100 shadow-sm"
      >
        {badgeText}
      </div>

      {/* 2. 중앙 3D 링 아크 + 부엉이 + 중앙 원형 엠블럼 */}
      <div
        onClick={onClickOwl}
        className={`relative my-3.5 flex items-center justify-center ${
          onClickOwl ? "cursor-pointer transition-transform active:scale-95" : ""
        }`}
        style={{ width: compact ? 182 : 206, height: compact ? 182 : 206 }}
      >
        <svg
          viewBox="0 0 220 220"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={`ringGrad-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#e9d5ff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.55" />
            </linearGradient>
            <filter id={`ringShadow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#09031c" floodOpacity="0.4" />
            </filter>
          </defs>
          <path
            d="M 72 184 A 82 82 0 1 1 188 134"
            fill="none"
            stroke={`url(#ringGrad-${uid})`}
            strokeWidth="10.5"
            strokeLinecap="round"
            filter={`url(#ringShadow-${uid})`}
          />
        </svg>

        <div className="relative z-10 translate-y-1">
          <Owl src={owlSrc} alt={line1} size={compact ? 140 : 160} priority />
        </div>

        {/* 부엉이 가슴 중앙에서 빛나는 원형 기운 엠블럼 */}
        <div
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.9),0_4px_10px_rgba(0,0,0,0.25)]"
          style={{ color: theme.emblemColor }}
        >
          {emblemType === "flame" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C9.5 6 7 8.5 7 13a5 5 0 0 0 10 0c0-2-1-4-2.5-5.5-.3 1.5-1.2 2.5-2.5 2.5-1.5 0-2.5-1.5-2-3.5C10.5 4.8 12 2 12 2Z" />
            </svg>
          )}
          {emblemType === "clover" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 11C9.5 6.5 5 8 6.5 11.5C3 10 1.5 14.5 6 15.5C3.5 19 8 21.5 10.5 17C11 19.5 11 21 12 22C13 21 13 19.5 13.5 17C16 21.5 20.5 19 18 15.5C22.5 14.5 21 10 17.5 11.5C19 8 14.5 6.5 12 11Z" />
            </svg>
          )}
          {emblemType === "star" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2.5L14.6 9.4L21.5 12L14.6 14.6L12 21.5L9.4 14.6L2.5 12L9.4 9.4L12 2.5Z" />
            </svg>
          )}
          {emblemType === "bolt" && (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" />
            </svg>
          )}
        </div>
      </div>

      {/* 3. 하단 2줄 기원 카피 */}
      <div className="relative z-10 mt-0.5">
        <p className="text-[22px] font-extrabold leading-[1.28] tracking-tight text-white drop-shadow-sm">
          {line1}
          <br />
          {line2}
        </p>
        {subText && (
          <p className="mt-2 text-[12px] font-medium text-purple-100/80">{subText}</p>
        )}
      </div>

      {/* 4. 최하단 미니멀 브랜드 로고 */}
      <div className="relative z-10 mt-4 flex items-center gap-1.5 text-purple-200/75">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3C7.5 3 4 6.5 4 11c0 3.2 1.8 6 4.5 7.3L12 21l3.5-2.7C18.2 17 20 14.2 20 11c0-4.5-3.5-8-8-8Zm-2.5 8.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
        </svg>
        <span className="text-[12.5px] font-bold tracking-tight">오늘의 업무 운세</span>
      </div>
    </div>
  );
}

/**
 * 내 행운 카드 프리뷰 & 이미지 저장 시트
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
  const theme = CARD_THEMES[meta.themeKey] ?? CARD_THEMES.violet;

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
        className="relative flex max-h-[92dvh] w-full max-w-[400px] flex-col items-center overflow-y-auto rounded-[36px] border border-white/15 px-6 py-7 text-white shadow-2xl"
      >
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="뒤로 가기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10"
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
          <span className="text-xs font-semibold text-white/70">행운 카드 저장</span>
          <div className="w-9" />
        </div>

        <div
          ref={captureRef}
          style={{ background: theme.sheetBg }}
          className="flex w-full flex-col items-center px-3 py-5"
        >
          <p className="mb-5 text-center text-[16px] font-bold leading-snug tracking-tight text-purple-100">
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

        <button
          type="button"
          onClick={handleDownload}
          disabled={saving}
          className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 text-[15px] font-bold text-white shadow-lg shadow-brand/40 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
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
