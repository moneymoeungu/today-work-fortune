"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Owl from "./Owl";
import { CARD_THEMES, LuckyTalismanCard } from "./LuckyTalismanCard";
import { track } from "@/lib/analytics";

export interface TalismanPreset {
  id: string;
  shortTitle: string;
  name: string;
  line1: string;
  line2: string;
  desc: string;
  owlSrc: string;
  themeKey: keyof typeof CARD_THEMES;
  defaultNote: string;
}

export const TALISMAN_PRESETS: TalismanPreset[] = [
  {
    id: "early-leave",
    shortTitle: "정시 칼퇴",
    name: "야근 퇴치 · 정시 칼퇴 부적",
    line1: "칼퇴의 기운",
    line2: "가볍게 퇴근하소서",
    desc: "오늘 맡은 업무가 막힘없이 마무리되고 가벼운 발걸음으로 정시에 퇴근하도록 돕는 수호 부적이에요.",
    owlSrc: "/assets/owl/early-leave-fairy.png",
    themeKey: "violet",
    defaultNote: "오늘도 칼퇴하고 편안한 저녁 보내세요!",
  },
  {
    id: "approval-pass",
    shortTitle: "결재 통과",
    name: "결재 하이패스 · 무사통과 부적",
    line1: "승인의 기운",
    line2: "단번에 통과하소서",
    desc: "올리는 보고서와 기획안마다 수정 없이 한 번에 승인되고 칭찬이 따르는 행운의 부적이에요.",
    owlSrc: "/assets/owl/approval-smooth.png",
    themeKey: "plum",
    defaultNote: "오늘 올리는 안건마다 한 번에 통과되길!",
  },
  {
    id: "fast-promotion",
    shortTitle: "초고속 승진",
    name: "커리어 점프 · 초고속 승진 부적",
    line1: "승진의 기운",
    line2: "높이 날아오르소서",
    desc: "해내는 업무마다 실력을 확실히 인정받고 커리어가 한 단계 쑥 도약하는 승진 기원 부적이에요.",
    owlSrc: "/assets/owl/smart-growth.png",
    themeKey: "amethyst",
    defaultNote: "올해 가장 높이 도약하고 승승장구하시길!",
  },
  {
    id: "bonus-jackpot",
    shortTitle: "성과급 대박",
    name: "인센티브 폭발 · 성과급 부적",
    line1: "보상의 기운",
    line2: "두둑하게 쌓이소서",
    desc: "땀 흘린 노력 이상으로 고과와 성과급, 기분 좋은 보상이 두둑하게 따라붙는 행운 부적이에요.",
    owlSrc: "/assets/owl/hidden-mvp.png",
    themeKey: "violet",
    defaultNote: "최고의 성과와 두둑한 보상이 함께하길 응원해요!",
  },
  {
    id: "presentation-win",
    shortTitle: "발표 대박",
    name: "언변 폭발 · 프레젠테이션 부적",
    line1: "말발의 기운",
    line2: "시원하게 터지소서",
    desc: "중요한 보고와 미팅 자리에서 떨림 없이 핵심을 찌르고 박수갈채를 받는 발표 수호 부적이에요.",
    owlSrc: "/assets/owl/presentation-king.png",
    themeKey: "plum",
    defaultNote: "오늘 발표와 미팅 완벽하게 빛나시길!",
  },
  {
    id: "idea-genius",
    shortTitle: "기획 천재",
    name: "막힌 기획 뚫리는 아이디어 부적",
    line1: "영감의 기운",
    line2: "반짝이게 샘솟으소서",
    desc: "답답하게 막혀 있던 기획안과 문서에 반짝이는 한 줄이 마법처럼 떠오르는 영감 부적이에요.",
    owlSrc: "/assets/owl/idea-planner.png",
    themeKey: "indigo",
    defaultNote: "반짝이는 아이디어가 술술 떠오르는 하루 되세요!",
  },
  {
    id: "mental-peace",
    shortTitle: "멘탈 수호",
    name: "스트레스 방어 · 평온 수호 부적",
    line1: "평온의 기운",
    line2: "여유롭게 채우소서",
    desc: "바쁜 일정 속에서도 내 마음의 여유를 잃지 않고 평온하게 하루를 보내도록 지켜주는 부적이에요.",
    owlSrc: "/assets/owl/recharge-day.png",
    themeKey: "violet",
    defaultNote: "오늘 하루 스트레스 없이 평온하고 여유롭길!",
  },
  {
    id: "coffee-boost",
    shortTitle: "에너지 충전",
    name: "피로 소멸 · 에너지 만렙 부적",
    line1: "활력의 기운",
    line2: "상쾌하게 깨어나소서",
    desc: "지치기 쉬운 오후 시간에도 맑은 집중력과 상쾌한 컨디션을 끝까지 지켜주는 충전 부적이에요.",
    owlSrc: "/assets/owl/coffee-monday.png",
    themeKey: "indigo",
    defaultNote: "지치지 않는 상쾌한 하루 보내시길 응원해요!",
  },
];

interface GiftModalProps {
  senderName: string;
  senderTeam: string;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export function TalismanGiftModal({ senderName, senderTeam, onClose, onToast }: GiftModalProps) {
  const [receiver, setReceiver] = useState("");
  const [selectedId, setSelectedId] = useState<string>(TALISMAN_PRESETS[0].id);
  const [customNote, setCustomNote] = useState(TALISMAN_PRESETS[0].defaultNote);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const preset = TALISMAN_PRESETS.find((p) => p.id === selectedId) ?? TALISMAN_PRESETS[0];
  const toName = receiver.trim() || "소중한 동료";

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const handleSelectPreset = (t: TalismanPreset) => {
    setSelectedId(t.id);
    if (TALISMAN_PRESETS.some((p) => p.defaultNote === customNote)) {
      setCustomNote(t.defaultNote);
    }
  };

  const buildGiftUrl = () => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      gift: preset.id,
      to: toName,
      from: `${senderTeam} ${senderName}`.trim(),
      note: customNote.trim() || preset.defaultNote,
    });
    return `${base}?${params.toString()}`;
  };

  const copyGiftLink = async () => {
    track("share_click", { type: "talisman_gift_link", talisman: preset.id });
    const url = buildGiftUrl();
    const text = `[부엉이 행운 부적 도착]\n${senderTeam} ${senderName}님이 ${toName}님에게 「${preset.name}」을 선물했어요!\n\n"${customNote.trim() || preset.defaultNote}"\n\n아래 링크를 눌러 부적을 확인하고 오늘의 업무 운세도 뽑아보세요\n${url}`;
    try {
      await navigator.clipboard.writeText(text);
      onToast("부적 선물 링크가 복사되었어요! 동료에게 카톡/메신저로 붙여넣어 보세요");
    } catch {
      onToast("링크 복사에 실패했어요");
    }
  };

  const saveGiftImage = async () => {
    if (saving || !cardRef.current) return;
    setSaving(true);
    track("image_save", { type: "talisman_gift_image", talisman: preset.id });
    try {
      const { toPng } = await import("html-to-image");
      const opts = { pixelRatio: 2.5, cacheBust: true };
      let dataUrl: string;
      try {
        dataUrl = await toPng(cardRef.current, opts);
      } catch {
        dataUrl = await toPng(cardRef.current, { ...opts, skipFonts: true });
      }
      const ua = navigator.userAgent;
      if (/KAKAOTALK|iPhone|iPad|iPod/i.test(ua)) {
        setPreviewUrl(dataUrl);
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `부엉이-행운부적-${toName}님께.png`;
        a.click();
        onToast("선물용 부적 이미지를 저장했어요! 동료에게 보내보세요");
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
        className="relative max-h-[92dvh] w-full max-w-[420px] overflow-y-auto rounded-[28px] border border-white/15 bg-[#160c30] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
      >
        {/* 상단 헤더 (LUCKY OWL TALISMAN 및 이모지 제거) */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] font-bold tracking-tight text-white">
            동료에게 부엉이 부적 선물하기
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 1. 부적 종류 선택 (회사·업무 맞춤형 8종 / 4x2 그리드) */}
        <div className="mt-3.5 grid grid-cols-4 gap-1.5">
          {TALISMAN_PRESETS.map((t) => {
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectPreset(t)}
                className={`group relative flex flex-col items-center rounded-2xl border px-1 py-2 text-center transition-all ${
                  active
                    ? "border-[#e8cf8c]/75 bg-gradient-to-b from-[#e8cf8c]/18 to-[#e8cf8c]/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "border-white/10 bg-white/[0.03] opacity-65 hover:border-white/20 hover:opacity-95"
                }`}
              >
                <div className="mb-1 flex h-8 w-8 items-center justify-center">
                  <Owl src={t.owlSrc} alt={t.shortTitle} size={32} />
                </div>
                <span
                  className={`text-[11px] font-semibold tracking-tight ${
                    active ? "text-[#f7e5b4]" : "text-white/80"
                  }`}
                >
                  {t.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. 받는 사람 & 응원 메시지 입력 */}
        <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2.5">
            <label htmlFor="gift-receiver" className="w-16 shrink-0 text-[12px] font-medium text-white/60">
              받는 동료
            </label>
            <input
              id="gift-receiver"
              value={receiver}
              maxLength={12}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="이름 또는 직급 (예: 김대리)"
              className="h-9 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 text-[13px] text-white placeholder:text-white/35 focus:border-[#e8cf8c]/60 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <label htmlFor="gift-note" className="w-16 shrink-0 text-[12px] font-medium text-white/60">
              응원 문구
            </label>
            <input
              id="gift-note"
              value={customNote}
              maxLength={32}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="따뜻한 한마디를 적어보세요"
              className="h-9 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 text-[13px] text-white placeholder:text-white/35 focus:border-[#e8cf8c]/60 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. 캡처 영역: 레퍼런스 형식(상단 문구 + 은은한 퍼플 행운 카드) */}
        <div
          ref={cardRef}
          style={{ background: "linear-gradient(180deg, #1d103d 0%, #140a2e 100%)" }}
          className="mt-3 flex flex-col items-center rounded-3xl px-3 py-4"
        >
          <p className="mb-3.5 text-center text-[14.5px] font-bold leading-snug text-purple-100">
            {month}월 {day}일 {toName}님에게
            <br />
            {senderName}님이 행운의 기운을 전해드려요
          </p>

          <LuckyTalismanCard
            badgeText={preset.name}
            owlSrc={preset.owlSrc}
            line1={preset.line1}
            line2={preset.line2}
            subText={`“${customNote.trim() || preset.defaultNote}”`}
            themeKey={preset.themeKey}
            compact
          />
        </div>

        {/* 4. 하단 액션 바: 이미지 저장 | 선물 링크 복사 */}
        <div className="mt-3.5 grid grid-cols-[1fr_1.35fr] gap-2.5">
          <button
            type="button"
            onClick={saveGiftImage}
            disabled={saving}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.07] px-3 text-[13.5px] font-semibold text-white/90 transition hover:bg-white/[0.13] active:scale-[0.98] disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 4V15M12 15L8 11M12 15L16 11M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{saving ? "저장 중…" : "이미지 저장"}</span>
          </button>

          <button
            type="button"
            onClick={copyGiftLink}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#f7e5b4]/50 bg-gradient-to-b from-[#f3dc99] to-[#d8b459] px-4 text-[14px] font-bold text-[#1b0e38] shadow-[0_8px_20px_-4px_rgba(216,180,89,0.4),inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:brightness-105 active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>선물 링크 복사</span>
          </button>
        </div>

        {previewUrl && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-5">
            <p className="mb-3 text-center text-sm">부적 이미지를 길게 눌러 저장해 주세요 📲</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="선물할 부적 이미지" className="max-h-[68dvh] rounded-2xl" />
            <button
              onClick={() => setPreviewUrl(null)}
              className="mt-4 h-11 rounded-2xl bg-white px-8 text-sm font-bold text-night-800"
            >
              닫기
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/**
 * 동료가 보낸 행운 부적 링크(?gift=...)를 클릭해서 접속했을 때 뜨는 환영 시트
 */
export function ReceivedGiftModal({
  giftId,
  toName,
  fromName,
  note,
  onClose,
}: {
  giftId: string;
  toName: string;
  fromName: string;
  note: string;
  onClose: () => void;
}) {
  const preset = TALISMAN_PRESETS.find((p) => p.id === giftId) ?? TALISMAN_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex w-full max-w-[390px] flex-col items-center rounded-[32px] border border-white/15 bg-gradient-to-b from-[#251454] to-[#140a2e] px-6 py-7 text-center text-white shadow-2xl"
      >
        <span className="mb-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-200">
          🎁 깜짝 행운 부적이 도착했어요!
        </span>
        <p className="mb-4 text-[15px] font-bold leading-snug text-purple-100">
          <span className="text-amber-200">{fromName || "동료"}</span>님이{" "}
          <span className="text-white">{toName || "당신"}</span>님에게
          <br />
          행운의 기운을 전해드려요
        </p>

        <LuckyTalismanCard
          badgeText={preset.name}
          owlSrc={preset.owlSrc}
          line1={preset.line1}
          line2={preset.line2}
          subText={`“${note || preset.defaultNote}”`}
          themeKey={preset.themeKey}
          compact
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-brand px-8 text-[15px] font-bold text-white shadow-lg shadow-brand/40 transition hover:brightness-110 active:scale-95"
        >
          부적 받고 나도 오늘의 운세 뽑기 🔮
        </button>
      </motion.div>
    </div>
  );
}
