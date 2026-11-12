"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Owl from "./Owl";
import { track } from "@/lib/analytics";

export interface CardTheme {
  bgGrad: string;
  pillBg: string;
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

/** 운세 ID별 레퍼런스 스타일 2줄 기원 문구 & 그 운세에 딱 맞는 1줄 부엉이 말풍선 조언 */
export function getFortuneCardMeta(fortuneId: string): {
  line1: string;
  line2: string;
  owlAdvice: string;
  themeKey: keyof typeof CARD_THEMES;
} {
  switch (fortuneId) {
    case "presentation-king":
      return {
        line1: "말발의 기운",
        line2: "시원하게 터지소서",
        owlAdvice: "첫 문장만 당당하게 꺼내면 오늘 회의실 분위기는 완전히 내 편이에요!",
        themeKey: "plum",
      };
    case "approval-smooth":
      return {
        line1: "결재의 기운",
        line2: "단번에 통과하소서",
        owlAdvice: "망설이던 보고서나 요청이 있다면 오전에 바로 올려보세요. 한 번에 통과돼요!",
        themeKey: "violet",
      };
    case "idea-planner":
      return {
        line1: "영감의 기운",
        line2: "반짝이게 샘솟으소서",
        owlAdvice: "스쳐 지나간 엉뚱한 생각도 메모해 두세요. 오늘 최고의 기획안이 될 거예요!",
        themeKey: "indigo",
      };
    case "smart-growth":
      return {
        line1: "성장의 기운",
        line2: "거침없이 오르소서",
        owlAdvice: "어제 막혔던 문제도 오늘은 퍼즐 맞추듯 명쾌하게 해결될 거예요!",
        themeKey: "amethyst",
      };
    case "teamwork-synergy":
      return {
        line1: "호흡의 기운",
        line2: "찰떡같이 맞으소서",
        owlAdvice: "혼자 고민하지 말고 옆자리 동료에게 가볍게 물어보면 10분 만에 풀려요!",
        themeKey: "plum",
      };
    case "focus-master":
      return {
        line1: "몰입의 기운",
        line2: "단숨에 끝내소서",
        owlAdvice: "이어폰을 끼고 딱 40분만 몰입해 보세요. 오늘 할 일의 절반이 끝날 거예요!",
        themeKey: "indigo",
      };
    case "early-leave-fairy":
      return {
        line1: "칼퇴의 기운",
        line2: "가볍게 퇴근하소서",
        owlAdvice: "오후 4시 전에 핵심 업무만 먼저 체크해 두면 오늘 정시 퇴근은 확정이에요!",
        themeKey: "violet",
      };
    case "communication-pro":
      return {
        line1: "소통의 기운",
        line2: "물 흐르듯 풀리소서",
        owlAdvice: "까다로운 협의나 메일 답장도 오늘 보내면 상대방이 흔쾌히 오케이할 거예요!",
        themeKey: "amethyst",
      };
    case "double-check":
      return {
        line1: "철벽의 기운",
        line2: "빈틈없이 지키소서",
        owlAdvice: "전송 버튼을 누르기 전에 딱 3초만 첨부파일과 숫자를 확인하면 완벽해요!",
        themeKey: "indigo",
      };
    case "recharge-day":
      return {
        line1: "평온의 기운",
        line2: "여유롭게 채우소서",
        owlAdvice: "오늘은 완벽함보다 내 컨디션이 먼저예요. 틈틈이 스트레칭하며 쉬어가세요!",
        themeKey: "violet",
      };
    case "coffee-monday":
      return {
        line1: "활력의 기운",
        line2: "상쾌하게 깨어나소서",
        owlAdvice: "시원한 커피 한 모금으로 먼저 예열해 보세요. 오후부터 텐션이 쑥 올라가요!",
        themeKey: "amethyst",
      };
    case "bonus-windfall":
      return {
        line1: "보상의 기운",
        line2: "두둑하게 쌓이소서",
        owlAdvice: "그동안 공들인 노력이 눈에 보이는 실적과 기분 좋은 보상으로 돌아올 거예요!",
        themeKey: "violet",
      };
    case "meeting-shortener":
      return {
        line1: "속전속결 기운",
        line2: "시원하게 끝나소서",
        owlAdvice: "회의 시작할 때 결론 한 줄만 먼저 던져보세요. 회의 시간이 절반으로 줄어들어요!",
        themeKey: "plum",
      };
    case "praise-relay":
      return {
        line1: "칭찬의 기운",
        line2: "사방에서 쏟아지소서",
        owlAdvice: "오늘 내 이름이 좋은 일로 오르내릴 거예요. 기분 좋게 미소로 화답해 보세요!",
        themeKey: "violet",
      };
    case "creative-spark":
      return {
        line1: "문장의 기운",
        line2: "막힘없이 써지소서",
        owlAdvice: "첫 문장만 가볍게 적어 내려가면 마지막 페이지까지 단숨에 완성될 거예요!",
        themeKey: "indigo",
      };
    case "career-jump":
      return {
        line1: "도약의 기운",
        line2: "한 단계 레벨업하소서",
        owlAdvice: "오늘 해결한 까다로운 과제가 내 몸값을 높여주는 가장 든든한 무기가 돼요!",
        themeKey: "amethyst",
      };
    case "lucky-helper":
      return {
        line1: "귀인의 기운",
        line2: "든든하게 도우소서",
        owlAdvice: "점심이나 티타임에 나눈 가벼운 대화 속에서 찾던 해답을 얻게 될 거예요!",
        themeKey: "plum",
      };
    case "deadline-clear":
      return {
        line1: "완주의 기운",
        line2: "시원하게 비워내소서",
        owlAdvice: "가장 쉬운 할 일 하나부터 체크 표시로 지워보세요. 순식간에 올클리어할 수 있어요!",
        themeKey: "indigo",
      };
    case "evening-freedom":
      return {
        line1: "자유의 기운",
        line2: "저녁을 만끽하소서",
        owlAdvice: "근무 시간 안에 딱 집중해 끝내고, 오늘 저녁은 온전히 나를 위해 써보세요!",
        themeKey: "violet",
      };
    case "negotiation-master":
      return {
        line1: "설득의 기운",
        line2: "부드럽게 이끄소서",
        owlAdvice: "무리한 일정 요청에는 대안 일정을 먼저 제시해 보세요. 상대방도 흔쾌히 수긍해요!",
        themeKey: "amethyst",
      };
    case "calm-organizer":
      return {
        line1: "정돈의 기운",
        line2: "명쾌하게 정리되소서",
        owlAdvice: "바탕화면과 탭만 먼저 정리해도 머릿속이 맑아지며 일 처리가 2배 빨라져요!",
        themeKey: "indigo",
      };
    case "mental-shield":
      return {
        line1: "방어의 기운",
        line2: "평온하게 지키소서",
        owlAdvice: "주변이 소란스러워도 내 페이스만 지키면 아무런 스트레스 없이 지나갈 거예요!",
        themeKey: "violet",
      };
    case "lunch-jackpot":
      return {
        line1: "미식의 기운",
        line2: "맛있게 충전하소서",
        owlAdvice: "오늘 점심 메뉴 선택은 100점 만점이에요! 든든하게 먹고 오후도 가볍게 넘겨보세요!",
        themeKey: "plum",
      };
    case "hidden-mvp":
    default:
      return {
        line1: "대박의 기운",
        line2: "활활 타오르소서",
        owlAdvice: "묵묵히 해오던 내 노력이 드디어 빛을 발해 기분 좋은 칭찬으로 돌아올 거예요!",
        themeKey: "plum",
      };
  }
}

interface LuckyCardProps {
  badgeText?: string;
  owlSrc: string;
  line1: string;
  line2: string;
  subText?: string;
  themeKey?: keyof typeof CARD_THEMES;
  speechBubble?: string | null;
  onClickOwl?: () => void;
  compact?: boolean;
}

/**
 * 첨부 레퍼런스(토스 행운 카드) 레이아웃에 맞춘 밤하늘 벨벳 퍼플 행운 카드
 * - 번개 원형 배지 제거로 부엉이 소품과 3D 링이 깔끔하게 보이도록 구성
 * - 결과 화면에서 부엉이를 클릭하면 말풍선(speechBubble)이 on/off 토글됨 (이미지 저장 시에는 미노출)
 */
export function LuckyTalismanCard({
  badgeText = "행운 카드",
  owlSrc,
  line1,
  line2,
  subText,
  themeKey = "violet",
  speechBubble = null,
  onClickOwl,
  compact = false,
}: LuckyCardProps) {
  const theme = CARD_THEMES[themeKey] ?? CARD_THEMES.violet;

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

      {/* 2. 중앙 3D 링 아크 + 부엉이 + (토글 시 나타나는 부엉이 말풍선) */}
      <div
        onClick={onClickOwl}
        className={`relative my-3.5 flex items-center justify-center ${
          onClickOwl ? "cursor-pointer transition-transform active:scale-95" : ""
        }`}
        style={{ width: compact ? 182 : 206, height: compact ? 182 : 206 }}
      >
        {/* 부엉이 말풍선 (클릭 시 on/off 토글, 저장용 카드에서는 렌더링되지 않음) */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              key="owl-bubble"
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className=" absolute -top-5 left-1/2 z-30 w-[238px] -translate-x-1/2 rounded-2xl bg-white px-3.5 py-2.5 text-center text-[12px] font-bold leading-snug text-[#231152] shadow-[0_10px_28px_rgba(0,0,0,0.38)]"
            >
              <span>{speechBubble}</span>
              {/* 말풍선 아래 꼬리 */}
              <span
                aria-hidden
                className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <svg
          viewBox="0 0 220 220"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <linearGradient id={`ringGrad-${themeKey}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#e9d5ff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.55" />
            </linearGradient>
            <filter id={`ringShadow-${themeKey}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#09031c" floodOpacity="0.4" />
            </filter>
          </defs>
          <path
            d="M 72 184 A 82 82 0 1 1 188 134"
            fill="none"
            stroke={`url(#ringGrad-${themeKey})`}
            strokeWidth="10.5"
            strokeLinecap="round"
            filter={`url(#ringShadow-${themeKey})`}
          />
        </svg>

        <div className="relative z-10 translate-y-1">
          <Owl src={owlSrc} alt={line1} size={compact ? 144 : 164} priority />
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
 * 내 행운 카드 프리뷰 & 이미지 저장 시트 (말풍선 없이 깔끔한 카드만 저장됨)
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
