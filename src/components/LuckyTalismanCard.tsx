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

/** 운세 ID별 레퍼런스 스타일 2줄 기원 문구 & 그 운세에 딱 맞는 1줄(자연스러운 2행) 부엉이 말풍선 조언 */
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
        owlAdvice: "첫 문장만 당당하게 꺼내 보세요\n오늘 회의실 분위기는 완전히 내 편이에요",
        themeKey: "plum",
      };
    case "approval-smooth":
      return {
        line1: "결재의 기운",
        line2: "단번에 통과하소서",
        owlAdvice: "망설이던 보고서는 오전에 바로 올려보세요\n수정 없이 한 번에 기분 좋게 통과돼요",
        themeKey: "violet",
      };
    case "idea-planner":
      return {
        line1: "영감의 기운",
        line2: "반짝이게 샘솟으소서",
        owlAdvice: "스쳐 지나간 작은 생각도 메모해 두세요\n오늘 가장 빛나는 메인 기획안이 될 거예요",
        themeKey: "indigo",
      };
    case "smart-growth":
      return {
        line1: "성장의 기운",
        line2: "거침없이 오르소서",
        owlAdvice: "어제 막혔던 문제도 다시 펼쳐 보세요\n오늘은 퍼즐 맞추듯 명쾌하게 해결돼요",
        themeKey: "amethyst",
      };
    case "teamwork-synergy":
      return {
        line1: "호흡의 기운",
        line2: "찰떡같이 맞으소서",
        owlAdvice: "혼자 고민하지 말고 동료에게 가볍게 물어보세요\n대화가 시작되면 10분 만에 실마리가 풀려요",
        themeKey: "plum",
      };
    case "focus-master":
      return {
        line1: "몰입의 기운",
        line2: "단숨에 끝내소서",
        owlAdvice: "이어폰을 끼고 딱 40분만 몰입해 보세요\n오늘 할 일의 절반이 순식간에 끝날 거예요",
        themeKey: "indigo",
      };
    case "early-leave-fairy":
      return {
        line1: "칼퇴의 기운",
        line2: "가볍게 퇴근하소서",
        owlAdvice: "오후 4시 전에 핵심 업무만 먼저 끝내 두세요\n오늘은 가벼운 발걸음으로 정시 퇴근 확정이에요",
        themeKey: "violet",
      };
    case "communication-pro":
      return {
        line1: "소통의 기운",
        line2: "물 흐르듯 풀리소서",
        owlAdvice: "까다로운 협의나 메일도 오늘 먼저 보내보세요\n상대방이 흔쾌히 고개를 끄덕일 거예요",
        themeKey: "amethyst",
      };
    case "double-check":
      return {
        line1: "철벽의 기운",
        line2: "빈틈없이 지키소서",
        owlAdvice: "전송 버튼을 누르기 전 딱 3초만 더 확인해 보세요\n작은 디테일 하나가 내 완벽함을 지켜줘요",
        themeKey: "indigo",
      };
    case "recharge-day":
      return {
        line1: "평온의 기운",
        line2: "여유롭게 채우소서",
        owlAdvice: "오늘은 완벽함보다 내 컨디션이 먼저예요\n따뜻한 차 한 잔과 함께 여유롭게 쉬어가세요",
        themeKey: "violet",
      };
    case "coffee-monday":
      return {
        line1: "활력의 기운",
        line2: "상쾌하게 깨어나소서",
        owlAdvice: "시원한 커피 한 모금으로 가볍게 예열해 보세요\n오후부터 집중력과 텐션이 쑥 올라가요",
        themeKey: "amethyst",
      };
    case "bonus-windfall":
      return {
        line1: "보상의 기운",
        line2: "두둑하게 쌓이소서",
        owlAdvice: "그동안 공들인 노력이 결실을 맺는 날이에요\n눈에 보이는 성과와 기분 좋은 보상이 따라와요",
        themeKey: "violet",
      };
    case "meeting-shortener":
      return {
        line1: "속전속결 기운",
        line2: "시원하게 끝나소서",
        owlAdvice: "회의 시작할 때 결론 한 줄만 먼저 꺼내 보세요\n길어지던 회의가 절반으로 짧아질 거예요",
        themeKey: "plum",
      };
    case "praise-relay":
      return {
        line1: "칭찬의 기운",
        line2: "사방에서 쏟아지소서",
        owlAdvice: "오늘 내 이름이 좋은 일로 자주 오르내릴 거예요\n칭찬이 들려오면 환한 미소로 화답해 보세요",
        themeKey: "violet",
      };
    case "creative-spark":
      return {
        line1: "문장의 기운",
        line2: "막힘없이 써지소서",
        owlAdvice: "첫 문장만 가볍게 적어 내려가 보세요\n마지막 페이지까지 막힘없이 술술 완성돼요",
        themeKey: "indigo",
      };
    case "career-jump":
      return {
        line1: "도약의 기운",
        line2: "한 단계 레벨업하소서",
        owlAdvice: "오늘 해낸 까다로운 과제가 큰 자산이 돼요\n내 가치를 높여주는 가장 든든한 무기가 될 거예요",
        themeKey: "amethyst",
      };
    case "lucky-helper":
      return {
        line1: "귀인의 기운",
        line2: "든든하게 도우소서",
        owlAdvice: "점심이나 티타임의 가벼운 대화를 놓치지 마세요\n뜻밖의 동료에게서 찾던 해답을 얻게 돼요",
        themeKey: "plum",
      };
    case "deadline-clear":
      return {
        line1: "완주의 기운",
        line2: "시원하게 비워내소서",
        owlAdvice: "가장 쉬운 할 일 하나부터 먼저 지워보세요\n탄력이 붙어 밀린 숙제를 단숨에 끝낼 수 있어요",
        themeKey: "indigo",
      };
    case "evening-freedom":
      return {
        line1: "자유의 기운",
        line2: "저녁을 만끽하소서",
        owlAdvice: "근무 시간 안에 에너지를 딱 모아 끝내 보세요\n오늘 저녁 시간은 온전히 나를 위한 선물이에요",
        themeKey: "violet",
      };
    case "negotiation-master":
      return {
        line1: "설득의 기운",
        line2: "부드럽게 이끄소서",
        owlAdvice: "무리한 요청엔 대안 일정을 먼저 제시해 보세요\n부드러운 말투가 상대방의 수긍을 이끌어내요",
        themeKey: "amethyst",
      };
    case "calm-organizer":
      return {
        line1: "정돈의 기운",
        line2: "명쾌하게 정리되소서",
        owlAdvice: "바탕화면과 열린 탭부터 가볍게 정리해 보세요\n머릿속이 맑아지며 일 처리 속도가 두 배 빨라져요",
        themeKey: "indigo",
      };
    case "mental-shield":
      return {
        line1: "방어의 기운",
        line2: "평온하게 지키소서",
        owlAdvice: "주변이 분주해도 내 호흡과 페이스만 지켜보세요\n어떠한 스트레스도 나를 흔들지 못하는 날이에요",
        themeKey: "violet",
      };
    case "lunch-jackpot":
      return {
        line1: "미식의 기운",
        line2: "맛있게 충전하소서",
        owlAdvice: "오늘 점심 메뉴 선택은 백점 만점이에요\n맛있게 에너지 채우고 오후도 가볍게 넘겨보세요",
        themeKey: "plum",
      };
    case "hidden-mvp":
    default:
      return {
        line1: "대박의 기운",
        line2: "활활 타오르소서",
        owlAdvice: "묵묵히 챙겨 온 디테일이 드디어 빛을 발해요\n오늘 기분 좋은 인정과 칭찬으로 돌아올 거예요",
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
 * 밤하늘 벨벳 퍼플 행운 카드
 * - 인위적인 두꺼운 원형 링 대신, 카드 전체에 깔리는 은은한 성좌·다마스크 세공 무늬와
 *   부엉이 주변으로 잔잔하게 반짝이는 별빛 플레어·오로라 광원 연출
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
        compact ? "max-w-[295px] px-5 py-6 sm:px-6" : "max-w-[325px] px-5 py-7 sm:px-7"
      }`}
    >
      {/* 상단 은은한 라벤더 광원 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full opacity-25 blur-2xl"
        style={{ background: "#d8b4fe" }}
      />

      {/* 카드 전체에 잔잔하게 깔리는 은은한 성좌·세공 무늬 & 반짝이는 별빛 효과 */}
      <svg
        viewBox="0 0 320 420"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          {/* 은은한 마름모·성좌 배경 패턴 */}
          <pattern
            id={`cardPattern-${themeKey}`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 4 L 36 20 L 20 36 L 4 20 Z"
              fill="none"
              stroke="#f3e8ff"
              strokeWidth="0.45"
              strokeOpacity="0.06"
            />
            <circle cx="20" cy="20" r="0.7" fill="#f3e8ff" fillOpacity="0.09" />
            <circle cx="0" cy="0" r="0.6" fill="#f3e8ff" fillOpacity="0.07" />
            <circle cx="40" cy="0" r="0.6" fill="#f3e8ff" fillOpacity="0.07" />
            <circle cx="0" cy="40" r="0.6" fill="#f3e8ff" fillOpacity="0.07" />
            <circle cx="40" cy="40" r="0.6" fill="#f3e8ff" fillOpacity="0.07" />
          </pattern>

          {/* 카드 중앙 달빛·오로라 소프트 광원 */}
          <radialGradient id={`centerGlow-${themeKey}`} cx="50%" cy="44%" r="48%">
            <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.22" />
            <stop offset="52%" stopColor="#c084fc" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#3b217d" stopOpacity="0" />
          </radialGradient>

          {/* 별빛 플레어 후광 */}
          <radialGradient id={`starHalo-${themeKey}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#f3e8ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0" />
          </radialGradient>

          {/* 섬세한 내부 프레임 그라데이션 */}
          <linearGradient id={`frameStroke-${themeKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3e8ff" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#e9d5ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#f7dca1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1) 잔잔한 지오메트릭 성좌 무늬 타일 */}
        <rect width="320" height="420" fill={`url(#cardPattern-${themeKey})`} />

        {/* 2) 부엉이 뒤쪽 은은한 달빛 오로라 번짐 */}
        <ellipse cx="160" cy="182" rx="135" ry="125" fill={`url(#centerGlow-${themeKey})`} />

        {/* 3) 아주 가느다란 카드 내부 세공 보더 & 코너 곡선 무늬 */}
        <rect
          x="13"
          y="13"
          width="294"
          height="394"
          rx="24"
          fill="none"
          stroke={`url(#frameStroke-${themeKey})`}
          strokeWidth="0.75"
        />
        {/* 네 귀퉁이 은은한 세공 장식선 */}
        <g stroke="#f3e8ff" strokeOpacity="0.18" strokeWidth="0.7" fill="none">
          <path d="M 24 38 C 24 27 27 24 38 24" />
          <path d="M 296 38 C 296 27 293 24 282 24" />
          <path d="M 24 382 C 24 393 27 396 38 396" />
          <path d="M 296 382 C 296 393 293 396 282 396" />
        </g>

        {/* 4) 배경에 흐릿하게 이어지는 별자리 실선 */}
        <g stroke="#f3e8ff" strokeOpacity="0.14" strokeWidth="0.6" strokeDasharray="2 3" fill="none">
          <path d="M 44 96 L 78 74 L 112 88" />
          <path d="M 274 92 L 242 70 L 214 86" />
          <path d="M 48 264 L 82 288 L 66 318" />
          <path d="M 272 256 L 238 282 L 256 314" />
        </g>

        {/* 5) 카드 곳곳에 은은하게 반짝이는 십자 별빛(✦)과 별가루 */}
        {/* 좌상단 큰 별빛 */}
        <g transform="translate(56, 86)">
          <circle cx="0" cy="0" r="8" fill={`url(#starHalo-${themeKey})`} />
          <path
            d="M 0 -6.5 Q 0 0 6.5 0 Q 0 0 0 6.5 Q 0 0 -6.5 0 Q 0 0 0 -6.5 Z"
            fill="#ffffff"
            fillOpacity="0.85"
          />
        </g>
        {/* 우상단 큰 별빛 */}
        <g transform="translate(262, 102)">
          <circle cx="0" cy="0" r="9" fill={`url(#starHalo-${themeKey})`} />
          <path
            d="M 0 -7.5 Q 0 0 7.5 0 Q 0 0 0 7.5 Q 0 0 -7.5 0 Q 0 0 0 -7.5 Z"
            fill="#fff7ed"
            fillOpacity="0.9"
          />
        </g>
        {/* 좌하단 작은 별빛 */}
        <g transform="translate(62, 258)">
          <circle cx="0" cy="0" r="6.5" fill={`url(#starHalo-${themeKey})`} />
          <path
            d="M 0 -5 Q 0 0 5 0 Q 0 0 0 5 Q 0 0 -5 0 Q 0 0 0 -5 Z"
            fill="#f3e8ff"
            fillOpacity="0.75"
          />
        </g>
        {/* 우하단 중간 별빛 */}
        <g transform="translate(254, 246)">
          <circle cx="0" cy="0" r="7.5" fill={`url(#starHalo-${themeKey})`} />
          <path
            d="M 0 -6 Q 0 0 6 0 Q 0 0 0 6 Q 0 0 -6 0 Q 0 0 0 -6 Z"
            fill="#fde68a"
            fillOpacity="0.8"
          />
        </g>
        {/* 상단/하단 미세 반짝이 점 */}
        <g fill="#ffffff">
          <circle cx="78" cy="74" r="1.2" fillOpacity="0.55" />
          <circle cx="112" cy="88" r="0.9" fillOpacity="0.4" />
          <circle cx="242" cy="70" r="1.2" fillOpacity="0.5" />
          <circle cx="214" cy="86" r="0.9" fillOpacity="0.35" />
          <circle cx="42" cy="176" r="1.3" fillOpacity="0.5" />
          <circle cx="278" cy="172" r="1.1" fillOpacity="0.45" />
          <circle cx="82" cy="288" r="1.1" fillOpacity="0.4" />
          <circle cx="238" cy="282" r="1.2" fillOpacity="0.45" />
        </g>
      </svg>

      {/* 1. 상단 캡슐 배지 */}
      <div
        style={{ background: theme.pillBg }}
        className="relative z-10 rounded-full border border-white/15 px-4 py-1.5 text-[12.5px] font-bold tracking-tight text-purple-100 shadow-sm"
      >
        {badgeText}
      </div>

      {/* 2. 중앙 은은한 별빛 후광 + 부엉이 + (토글 시 나타나는 부엉이 말풍선) */}
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
            <div className="pointer-events-none absolute -inset-x-10 -top-2 z-30 flex justify-center">
              <motion.div
                key="owl-bubble"
                initial={{ opacity: 0, y: 6, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.94 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(31, 15, 74, 0.94) 0%, rgba(19, 8, 48, 0.96) 100%)",
                  border: "1px solid rgba(243, 220, 153, 0.42)",
                  boxShadow:
                    "0 12px 28px rgba(8, 3, 24, 0.65), 0 0 18px rgba(192, 132, 252, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
                }}
                className="relative w-max max-w-[258px] rounded-2xl px-3.5 py-2.5 text-center backdrop-blur-md sm:max-w-[268px] sm:px-4"
              >
                <p className="whitespace-pre-line text-[11.5px] font-medium leading-[1.48] tracking-tight text-purple-50/95 sm:text-[12px]">
                  {speechBubble}
                </p>
                {/* 말풍선 아래 꼬리 (정중앙 고정) */}
                <span
                  aria-hidden
                  style={{
                    background: "rgba(19, 8, 48, 0.96)",
                    borderRight: "1px solid rgba(243, 220, 153, 0.42)",
                    borderBottom: "1px solid rgba(243, 220, 153, 0.42)",
                  }}
                  className="absolute -bottom-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45"
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 부엉이 뒤쪽 은은한 달빛 글로우 & 잔잔한 반짝임 (기존의 두꺼운 원형 링 제거) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-4 rounded-full opacity-40 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(243,232,255,0.55) 0%, rgba(192,132,252,0.18) 55%, transparent 75%)",
          }}
        />
        <svg
          viewBox="0 0 220 220"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          {/* 부엉이 주변에 살포시 흩날리는 잔잔한 빛무리와 작은 별빛 */}
          <g fill="#ffffff">
            <path
              d="M 34 72 Q 34 78 40 78 Q 34 78 34 84 Q 34 78 28 78 Q 34 78 34 72 Z"
              fill="#fef3c7"
              fillOpacity="0.85"
            />
            <path
              d="M 188 64 Q 188 69 193 69 Q 188 69 188 74 Q 188 69 183 69 Q 188 69 188 64 Z"
              fill="#f3e8ff"
              fillOpacity="0.8"
            />
            <path
              d="M 192 148 Q 192 152 196 152 Q 192 152 192 156 Q 192 152 188 152 Q 192 152 192 148 Z"
              fill="#fef3c7"
              fillOpacity="0.7"
            />
            <path
              d="M 28 144 Q 28 147.5 31.5 147.5 Q 28 147.5 28 151 Q 28 147.5 24.5 147.5 Q 28 147.5 28 144 Z"
              fill="#f3e8ff"
              fillOpacity="0.7"
            />
            <circle cx="52" cy="44" r="1.4" fillOpacity="0.55" />
            <circle cx="168" cy="42" r="1.3" fillOpacity="0.5" />
            <circle cx="22" cy="110" r="1.2" fillOpacity="0.45" />
            <circle cx="198" cy="108" r="1.4" fillOpacity="0.5" />
            <circle cx="48" cy="176" r="1.1" fillOpacity="0.4" />
            <circle cx="174" cy="178" r="1.2" fillOpacity="0.45" />
          </g>
        </svg>

        <div className="relative z-10 translate-y-1">
          <Owl src={owlSrc} alt={line1} size={compact ? 148 : 168} priority />
        </div>
      </div>

      {/* 3. 하단 2줄 기원 카피 */}
      <div className="relative z-10 mt-0.5 w-full">
        <p className="whitespace-nowrap text-[20px] font-extrabold leading-[1.28] tracking-tight text-white drop-shadow-sm sm:text-[22px]">
          {line1}
          <br />
          {line2}
        </p>
        {subText && (
          <p className="mt-2 whitespace-nowrap text-[11px] font-medium tracking-tight text-purple-100/80 sm:text-[12px]">
            {subText}
          </p>
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
