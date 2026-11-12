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
  emblemType: "flame" | "clover" | "star" | "bolt";
  defaultNote: string;
}

export const TALISMAN_PRESETS: TalismanPreset[] = [
  {
    id: "early-leave",
    shortTitle: "정시 칼퇴",
    name: "야근 퇴치 · 정시 칼퇴 부적",
    line1: "칼퇴의 기운",
    line2: "가볍게 퇴근하소서",
    desc: "오늘 맡은 업무가 막힘없이 마무리되고 가벼운 발걸음으로 정시에 퇴근하도록 돕는 행운 카드예요.",
    owlSrc: "/assets/owl/early-leave-fairy.png",
    themeKey: "emerald",
    emblemType: "clover",
    defaultNote: "오늘도 칼퇴하고 편안한 저녁 보내세요!",
  },
  {
    id: "approval-pass",
    shortTitle: "결재 통과",
    name: "결재 하이패스 · 무사통과 부적",
    line1: "승인의 기운",
    line2: "단번에 통과하소서",
    desc: "올리는 보고서와 기획안마다 수정 없이 한 번에 승인되고 칭찬이 따르는 행운 카드예요.",
    owlSrc: "/assets/owl/approval-smooth.png",
    themeKey: "coral",
    emblemType: "flame",
    defaultNote: "오늘 올리는 안건마다 한 번에 통과되길!",
  },
  {
    id: "coffee-boost",
    shortTitle: "활력 충전",
    name: "피로 소멸 · 에너지 충전 부적",
    line1: "활력의 기운",
    line2: "상쾌하게 깨어나소서",
    desc: "지치기 쉬운 오후 시간에도 맑은 집중력과 평온한 컨디션을 끝까지 지켜주는 행운 카드예요.",
    owlSrc: "/assets/owl/coffee-monday.png",
    themeKey: "amber",
    emblemType: "bolt",
    defaultNote: "지치지 않는 상쾌한 하루 보내시길 응원해요!",
  },
  {
    id: "super-mvp",
    shortTitle: "만사형통",
    name: "만사형통 · 오늘의 주인공 부적",
    line1: "대박의 기운",
    line2: "활활 타오르소서",
    desc: "손대는 일마다 좋은 결과로 이어지고 기분 좋은 소식이 찾아오는 만능 행운 카드예요.",
    owlSrc: "/assets/owl/hidden-mvp.png",
    themeKey: "violet",
    emblemType: "star",
    defaultNote: "오늘 하루도 가장 빛나는 주인공이 되세요!",
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
  const theme = CARD_THEMES[preset.themeKey] ?? CARD_THEMES.coral;
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
    const text = `[행운 카드 도착]\n${senderTeam} ${senderName}님이 ${toName}님에게 「${preset.line1} ${preset.line2}」 카드를 보냈어요.\n\n"${customNote.trim() || preset.defaultNote}"\n\n아래 링크에서 행운 카드를 확인해 보세요\n${url}`;
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
        a.download = `행운카드-${toName}님께.png`;
        a.click();
        onToast("선물용 행운 카드를 이미지로 저장했어요");
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
        className="relative max-h-[93dvh] w-full max-w-[410px] overflow-y-auto rounded-[36px] px-5 py-6 shadow-2xl transition-colors duration-300"
      >
        {/* 상단 네비게이션 바 (레퍼런스 형식) */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
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
          <span style={{ color: theme.sheetText }} className="text-[13px] font-bold opacity-80">
            동료에게 행운 카드 선물
          </span>
          <div className="w-9" />
        </div>

        {/* 1. 4종 행운 기운 선택 탭 (깔끔한 세그먼트 필) */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 rounded-2xl bg-black/[0.06] p-1">
          {TALISMAN_PRESETS.map((t) => {
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectPreset(t)}
                style={active ? { color: theme.sheetText } : undefined}
                className={`rounded-xl py-2 text-[12px] font-bold transition-all ${
                  active ? "bg-white shadow-sm" : "text-black/45 hover:text-black/70"
                }`}
              >
                {t.shortTitle}
              </button>
            );
          })}
        </div>

        {/* 2. 받는 동료 이름 & 메시지 입력 (밝고 미니멀한 인풋) */}
        <div className="mt-2.5 grid grid-cols-[1fr_1.4fr] gap-2">
          <input
            value={receiver}
            maxLength={10}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="받는 분 이름 (예: 혜지)"
            className="h-10 w-full rounded-2xl border border-black/10 bg-white/75 px-3.5 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 focus:border-black/25 focus:bg-white focus:outline-none"
          />
          <input
            value={customNote}
            maxLength={28}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="한 줄 응원 메시지"
            className="h-10 w-full rounded-2xl border border-black/10 bg-white/75 px-3.5 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 focus:border-black/25 focus:bg-white focus:outline-none"
          />
        </div>

        {/* 3. 캡처 영역 (첨부 레퍼런스와 동일한 구성: 상단 날짜·이름 문구 + 행운 카드) */}
        <div
          ref={cardRef}
          style={{ background: theme.sheetBg }}
          className="mt-1 flex w-full flex-col items-center px-3 py-4 transition-colors duration-300"
        >
          <p
            style={{ color: theme.sheetText }}
            className="mb-4 text-center text-[15.5px] font-bold leading-snug tracking-tight"
          >
            {month}월 {day}일 {toName}님에게
            <br />
            행운의 기운을 전해드려요
          </p>

          <LuckyTalismanCard
            badgeText="행운 카드"
            owlSrc={preset.owlSrc}
            line1={preset.line1}
            line2={preset.line2}
            subText={customNote.trim() || preset.defaultNote}
            themeKey={preset.themeKey}
            emblemType={preset.emblemType}
            compact
          />
        </div>

        {/* 4. 하단 캡슐 액션 버튼 (레퍼런스의 라운드 캡슐 버튼 스타일) */}
        <div className="mt-2 flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={saveGiftImage}
            disabled={saving}
            style={{ background: theme.buttonBg }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14.5px] font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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

          <button
            type="button"
            onClick={copyGiftLink}
            style={{ color: theme.sheetText }}
            className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-black/15 bg-white/80 px-5 text-[14px] font-bold shadow-sm transition hover:bg-white active:scale-95"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>링크 복사</span>
          </button>
        </div>

        {previewUrl && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-5 text-white">
            <p className="mb-3 text-center text-sm">이미지를 길게 눌러 저장해 주세요</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="선물할 행운 카드" className="max-h-[68dvh] rounded-3xl" />
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

/**
 * 동료가 보낸 행운 카드 링크(?gift=...)를 클릭해서 접속했을 때 뜨는 환영 시트
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
  const theme = CARD_THEMES[preset.themeKey] ?? CARD_THEMES.coral;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ background: theme.sheetBg }}
        className="flex w-full max-w-[390px] flex-col items-center rounded-[36px] px-6 py-7 text-center shadow-2xl"
      >
        <p
          style={{ color: theme.sheetText }}
          className="mb-4 text-[16px] font-bold leading-snug tracking-tight"
        >
          {fromName || "동료"}님이 {toName || "당신"}님에게
          <br />
          행운의 기운을 보내왔어요
        </p>

        <LuckyTalismanCard
          badgeText="행운 카드"
          owlSrc={preset.owlSrc}
          line1={preset.line1}
          line2={preset.line2}
          subText={note || preset.defaultNote}
          themeKey={preset.themeKey}
          emblemType={preset.emblemType}
          compact
        />

        <button
          type="button"
          onClick={onClose}
          style={{ background: theme.buttonBg }}
          className="mt-5 inline-flex h-12 items-center justify-center rounded-full px-8 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
        >
          기운 받고 내 오늘의 운세 뽑기
        </button>
      </motion.div>
    </div>
  );
}
