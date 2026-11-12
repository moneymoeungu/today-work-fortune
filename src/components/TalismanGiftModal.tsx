"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Owl from "./Owl";
import { track } from "@/lib/analytics";

export interface TalismanPreset {
  id: string;
  roman: string;
  shortTitle: string;
  name: string;
  badge: string;
  desc: string;
  owlSrc: string;
  accent: string;
  defaultNote: string;
}

export const TALISMAN_PRESETS: TalismanPreset[] = [
  {
    id: "early-leave",
    roman: "TALISMAN I",
    shortTitle: "정시 칼퇴",
    name: "야근 퇴치 · 정시 칼퇴 부적",
    badge: "칼퇴 기원 수호",
    desc: "오늘 맡은 업무가 막힘없이 마무리되고 가벼운 발걸음으로 정시에 퇴근하도록 돕는 수호 부적입니다.",
    owlSrc: "/assets/owl/early-leave-fairy.png",
    accent: "#6ee7b7",
    defaultNote: "오늘도 칼퇴하고 편안한 저녁 보내세요!",
  },
  {
    id: "approval-pass",
    roman: "TALISMAN II",
    shortTitle: "결재 통과",
    name: "결재 하이패스 · 무사통과 부적",
    badge: "원샷 승인 기원",
    desc: "올리는 보고서와 기획안마다 수정 없이 한 번에 승인되고 칭찬이 따르는 행운의 부적입니다.",
    owlSrc: "/assets/owl/approval-smooth.png",
    accent: "#fda4af",
    defaultNote: "오늘 올리는 안건마다 한 번에 통과되길!",
  },
  {
    id: "coffee-boost",
    roman: "TALISMAN III",
    shortTitle: "에너지 충전",
    name: "피로 소멸 · 에너지 만렙 부적",
    badge: "컨디션 회복",
    desc: "지치기 쉬운 오후 시간에도 맑은 집중력과 평온한 컨디션을 끝까지 지켜주는 충전 부적입니다.",
    owlSrc: "/assets/owl/coffee-monday.png",
    accent: "#fcd34d",
    defaultNote: "지치지 않는 상쾌한 하루 보내시길 응원해요!",
  },
  {
    id: "super-mvp",
    roman: "TALISMAN IV",
    shortTitle: "만사형통",
    name: "만사형통 · 오늘의 주인공 부적",
    badge: "인정 폭발 · 대박운",
    desc: "손대는 일마다 좋은 결과로 이어지고 기분 좋은 소식이 찾아오는 만능 행운 부적입니다.",
    owlSrc: "/assets/owl/hidden-mvp.png",
    accent: "#c4b5fd",
    defaultNote: "오늘 하루도 가장 빛나는 주인공이 되세요!",
  },
];

const QUICK_NOTES = [
  "오늘도 화이팅! 행운만 가득하길 응원해요",
  "오늘 무조건 정시 칼퇴하시길 기원해요",
  "진행하시는 일마다 술술 풀리길 바랍니다",
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
  const [customNote, setCustomNote] = useState(QUICK_NOTES[0]);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const preset = TALISMAN_PRESETS.find((p) => p.id === selectedId) ?? TALISMAN_PRESETS[0];
  const toName = receiver.trim() || "소중한 동료";

  const handleSelectPreset = (t: TalismanPreset) => {
    setSelectedId(t.id);
    if (QUICK_NOTES.includes(customNote) || TALISMAN_PRESETS.some((p) => p.defaultNote === customNote)) {
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
    const text = `[오늘의 업무 운세 · 행운 부적 선물]\n${senderTeam} ${senderName}님이 ${toName}님에게 「${preset.name}」을 보냈어요.\n\n"${customNote.trim() || preset.defaultNote}"\n\n아래 링크에서 부적을 확인해 보세요\n${url}`;
    try {
      await navigator.clipboard.writeText(text);
      onToast("선물 링크가 복사되었어요. 메신저나 카톡에 붙여넣어 보세요");
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
      const opts = { pixelRatio: 2, cacheBust: true };
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
        a.download = `행운부적-${toName}님께.png`;
        a.click();
        onToast("부적 카드를 이미지로 저장했어요");
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
        {/* 상단 헤더 */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-[#e8cf8c]/80">
              LUCKY OWL TALISMAN
            </p>
            <h3 className="mt-0.5 text-[18px] font-bold tracking-tight text-white">
              동료에게 행운 부적 선물하기
            </h3>
          </div>
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

        {/* 1. 부적 종류 선택 (4열 미니 비주얼 탭) */}
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {TALISMAN_PRESETS.map((t) => {
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectPreset(t)}
                className={`group relative flex flex-col items-center rounded-2xl border px-1.5 py-2.5 text-center transition-all ${
                  active
                    ? "border-[#e8cf8c]/75 bg-gradient-to-b from-[#e8cf8c]/18 to-[#e8cf8c]/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
                    : "border-white/10 bg-white/[0.03] opacity-65 hover:border-white/20 hover:opacity-95"
                }`}
              >
                <div className="mb-1 flex h-10 w-10 items-center justify-center">
                  <Owl src={t.owlSrc} alt={t.shortTitle} size={38} />
                </div>
                <span
                  className={`text-[12px] font-semibold tracking-tight ${
                    active ? "text-[#f7e5b4]" : "text-white/80"
                  }`}
                >
                  {t.shortTitle}
                </span>
                {active && (
                  <span className="mt-1 h-1 w-3.5 rounded-full bg-[#e8cf8c]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 2. 받는 사람 & 응원 메시지 입력 (잘림 없는 깔끔한 폼) */}
        <div className="mt-3.5 space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
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

        {/* 3. 실시간 타로 부적 카드 미리보기 (캡처 영역) */}
        <div className="mt-3.5 flex justify-center">
          <div
            ref={cardRef}
            className="relative flex w-full flex-col items-center overflow-hidden rounded-[22px] px-5 py-4 text-center"
            style={{
              background: "radial-gradient(circle at 50% 32%, #331c6e 0%, #1d0e42 58%, #120829 100%)",
              border: "1px solid rgba(232, 207, 140, 0.55)",
              boxShadow: "inset 0 0 0 4px rgba(18, 8, 41, 0.9), inset 0 0 0 5px rgba(232, 207, 140, 0.22)",
            }}
          >
            {/* 상단 수신/발신 라인 */}
            <div className="flex w-full items-center justify-between border-b border-[#e8cf8c]/20 pb-2 text-[11px] tracking-wide text-[#e8cf8c]/85">
              <span>To. {toName}님</span>
              <span className="text-[10px] tracking-[0.2em] text-[#e8cf8c]/60">{preset.roman}</span>
              <span>From. {senderName}</span>
            </div>

            {/* 부적 타이틀 */}
            <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-[#e8cf8c]">
              {preset.badge}
            </p>
            <h4 className="mt-1 font-serif text-[18px] font-bold tracking-tight text-white">
              {preset.name}
            </h4>

            {/* 중앙 부엉이 + 타로 성좌 후광 & 전각 낙관 */}
            <div className="relative my-2.5 flex items-center justify-center">
              <svg
                width="148"
                height="148"
                viewBox="0 0 148 148"
                className="pointer-events-none absolute opacity-40"
                aria-hidden
              >
                <circle
                  cx="74"
                  cy="74"
                  r="64"
                  fill="none"
                  stroke="#e8cf8c"
                  strokeWidth="0.8"
                  strokeDasharray="3 4"
                />
                <circle cx="74" cy="74" r="52" fill="none" stroke="#e8cf8c" strokeWidth="0.6" opacity="0.6" />
                <path d="M74 4 L76 10 L74 16 L72 10 Z" fill="#e8cf8c" />
                <path d="M74 132 L76 138 L74 144 L72 138 Z" fill="#e8cf8c" />
                <path d="M4 74 L10 76 L16 74 L10 72 Z" fill="#e8cf8c" />
                <path d="M132 74 L138 76 L144 74 L138 72 Z" fill="#e8cf8c" />
              </svg>

              <Owl src={preset.owlSrc} alt={preset.name} size={126} priority />

              {/* 전통 사각 전각 인장 스타일 디테일 */}
              <div
                className="absolute -right-2 bottom-1 flex h-11 w-11 flex-col items-center justify-center rounded-lg border border-[#f59e9e]/70 bg-[#9f1d35]/90 px-1 text-[#ffe4e6] shadow-md backdrop-blur-sm"
                style={{ transform: "rotate(-6deg)" }}
              >
                <span className="text-[8px] font-medium tracking-widest opacity-85">행운보증</span>
                <span className="mt-0.5 border-t border-[#fda4af]/40 pt-0.5 text-[10px] font-bold leading-none">
                  大吉
                </span>
              </div>
            </div>

            <p className="max-w-[290px] text-[12px] leading-relaxed text-white/75">
              {preset.desc}
            </p>

            {/* 하단 메시지 리본 */}
            <div className="mt-3 w-full rounded-xl border border-[#e8cf8c]/25 bg-black/30 px-3.5 py-2 text-[12.5px] font-medium text-[#f7e5b4]">
              “{customNote.trim() || preset.defaultNote}”
            </div>
          </div>
        </div>

        {/* 4. 하단 액션 바: 세련된 2열 버튼 (이미지 저장 | 선물 링크 복사) */}
        <div className="mt-4 grid grid-cols-[1fr_1.35fr] gap-2.5">
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

        <p className="mt-2.5 text-center text-[11px] text-white/45">
          복사한 링크를 카톡이나 메신저로 보내면 동료 화면에 부적이 열려요
        </p>

        {previewUrl && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-5">
            <p className="mb-3 text-center text-sm">부적 이미지를 길게 눌러 저장해 주세요</p>
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
 * 동료가 보낸 부적 선물 링크(?gift=...)를 클릭해서 접속했을 때 뜨는 환영 팝업
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex w-full max-w-[380px] flex-col items-center rounded-[28px] border border-[#e8cf8c]/45 bg-gradient-to-b from-[#2b155c] to-[#14082e] p-6 text-center text-white shadow-2xl"
      >
        <span className="rounded-full border border-[#e8cf8c]/35 bg-[#e8cf8c]/10 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-[#f3dc99]">
          ARRIVED TALISMAN GIFT
        </span>
        <p className="mt-2.5 text-sm text-white/80">
          <strong className="font-semibold text-[#f3dc99]">{fromName || "동료"}</strong>님이{" "}
          <strong className="font-semibold text-white">{toName || "당신"}</strong>님께 보낸 행운 부적이에요
        </p>

        <h3 className="mt-2 font-serif text-xl font-bold text-white">{preset.name}</h3>

        <div className="my-3">
          <Owl src={preset.owlSrc} alt={preset.name} size={150} float priority />
        </div>

        <p className="text-xs leading-relaxed text-white/75">{preset.desc}</p>
        {note && (
          <div className="mt-3.5 w-full rounded-xl border border-[#e8cf8c]/25 bg-black/25 px-4 py-2.5 text-[13px] font-medium text-[#f7e5b4]">
            “{note}”
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-[14.5px] font-bold text-white shadow-[0_8px_20px_-4px_rgba(109,40,217,0.5),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:brightness-105"
        >
          부적 받고 내 오늘의 운세 뽑기
        </button>
      </motion.div>
    </div>
  );
}
