"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Owl from "./Owl";
import { track } from "@/lib/analytics";

export interface TalismanPreset {
  id: string;
  name: string;
  badge: string;
  desc: string;
  owlSrc: string;
  accent: string;
}

export const TALISMAN_PRESETS: TalismanPreset[] = [
  {
    id: "early-leave",
    name: "야근 퇴치 · 정시 칼퇴 부적",
    badge: "칼퇴 100% 기원",
    desc: "오늘 할 일이 마법처럼 호로록 끝나고 정시에 가볍게 퇴근하게 해주는 수호 부적이에요!",
    owlSrc: "/assets/owl/early-leave-fairy.png",
    accent: "#4de0b8",
  },
  {
    id: "approval-pass",
    name: "결재 하이패스 · 무사통과 부적",
    badge: "한 번에 승인 완료",
    desc: "올리는 보고서와 요청마다 막힘없이 스무스하게 통과되는 행운의 부적이에요!",
    owlSrc: "/assets/owl/approval-smooth.png",
    accent: "#ff6b81",
  },
  {
    id: "coffee-boost",
    name: "피로 소멸 · 에너지 만렙 부적",
    badge: "식곤증·스트레스 퇴치",
    desc: "지치는 오후에도 머리 회전은 상쾌하게, 마음은 평온하게 지켜주는 충전 부적이에요!",
    owlSrc: "/assets/owl/coffee-monday.png",
    accent: "#ffd86b",
  },
  {
    id: "super-mvp",
    name: "만사형통 · 오늘의 주인공 부적",
    badge: "인정 폭발 · 대박운",
    desc: "손대는 일마다 칭찬받고 좋은 소식이 찾아오는 만능 행운 부적이에요!",
    owlSrc: "/assets/owl/hidden-mvp.png",
    accent: "#a97bff",
  },
];

interface GiftModalProps {
  senderName: string;
  senderTeam: string;
  onClose: () => void;
  onToast: (msg: string) => void;
}

/**
 * 동료에게 부엉이 부적 한 장 선물하기 모달:
 * 1) 받을 동료 이름과 응원 한마디 입력
 * 2) 4가지 부적 중 선택
 * 3) 부적 카드 이미지로 저장하거나, 클릭 시 부적이 열리는 선물 링크 복사!
 */
export function TalismanGiftModal({ senderName, senderTeam, onClose, onToast }: GiftModalProps) {
  const [receiver, setReceiver] = useState("");
  const [selectedId, setSelectedId] = useState<string>(TALISMAN_PRESETS[0].id);
  const [customNote, setCustomNote] = useState("오늘도 화이팅! 행운만 가득하길 응원해요 🍀");
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const preset = TALISMAN_PRESETS.find((p) => p.id === selectedId) ?? TALISMAN_PRESETS[0];
  const toName = receiver.trim() || "소중한 동료";

  const buildGiftUrl = () => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      gift: preset.id,
      to: toName,
      from: `${senderTeam} ${senderName}`.trim(),
      note: customNote.trim() || "오늘도 행운 가득한 하루 보내세요!",
    });
    return `${base}?${params.toString()}`;
  };

  const copyGiftLink = async () => {
    track("share_click", { type: "talisman_gift_link", talisman: preset.id });
    const url = buildGiftUrl();
    const text = `🧧 [부엉이 행운 부적 도착!]\n${senderTeam} ${senderName}님이 ${toName}님에게 「${preset.name}」을 선물했어요! 🦉✨\n\n💬 "${customNote.trim()}"\n\n아래 링크를 눌러 부적을 확인하고 오늘의 업무 운세도 뽑아보세요 👇\n${url}`;
    try {
      await navigator.clipboard.writeText(text);
      onToast("🎁 부적 선물 링크가 복사되었어요! 동료에게 카톡/메신저로 붙여넣어 보세요");
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
        a.download = `부엉이-행운부적-${toName}님께.png`;
        a.click();
        onToast("🧧 선물용 부적 이미지를 저장했어요! 동료에게 보내보세요");
      }
    } catch {
      onToast("저장에 실패했어요. 화면을 캡처해 주세요");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-3xl border border-amber-200/35 bg-[#1c0f3e] p-5 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-amber-200">🧧 동료에게 부엉이 부적 선물하기</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-white/80 hover:bg-white/20"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 text-xs text-white/70">
          부적을 골라 동료 이름을 적으면, 맞춤형 행운 부적 이미지나 선물 링크를 보낼 수 있어요!
        </p>

        {/* 1. 부적 종류 선택 (2x2 버튼) */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          {TALISMAN_PRESETS.map((t) => {
            const active = t.id === selectedId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`rounded-2xl border p-2.5 text-left transition ${
                  active
                    ? "border-amber-300 bg-amber-400/20 shadow-md"
                    : "border-white/15 bg-white/5 opacity-75 hover:opacity-100"
                }`}
              >
                <p className="text-[11px] font-bold text-amber-200">{t.badge}</p>
                <p className="mt-0.5 text-xs font-extrabold leading-snug text-white">{t.name}</p>
              </button>
            );
          })}
        </div>

        {/* 2. 받을 동료 이름 & 응원 한마디 입력 */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-white/70">받을 동료 이름</label>
            <input
              value={receiver}
              maxLength={12}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="예) 김대리, 박팀장님"
              className="mt-1 h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-xs text-white placeholder:text-white/45 focus:border-amber-300 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] text-white/70">짧은 응원 메시지</label>
            <input
              value={customNote}
              maxLength={28}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="오늘도 화이팅!"
              className="mt-1 h-10 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-xs text-white placeholder:text-white/45 focus:border-amber-300 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. 실시간 부적 카드 미리보기 (캡처 대상) */}
        <div className="mt-4 flex justify-center">
          <div
            ref={cardRef}
            className="relative flex w-full flex-col items-center overflow-hidden rounded-2xl p-4 text-center"
            style={{
              background: "linear-gradient(160deg, #3a1c78 0%, #210e4a 55%, #13072e 100%)",
              border: "2px solid rgba(251, 211, 116, 0.85)",
              boxShadow: "inset 0 0 0 3px rgba(251, 211, 116, 0.2)",
            }}
          >
            <div className="flex w-full items-center justify-between text-[11px] font-semibold text-amber-200/90">
              <span>To. {toName}님</span>
              <span>✦ 행운 수호 부적 ✦</span>
              <span>From. {senderName}</span>
            </div>

            <span className="mt-2.5 rounded-full border border-amber-300/60 bg-amber-400/20 px-3 py-0.5 text-[11px] font-bold text-amber-200">
              🧧 {preset.badge}
            </span>
            <h4 className="mt-1.5 text-lg font-black tracking-tight text-white">{preset.name}</h4>

            <div className="relative my-2 flex items-center justify-center">
              <Owl src={preset.owlSrc} alt={preset.name} size={135} priority />
              <div
                className=" absolute -right-5 bottom-1 flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-rose-200 bg-rose-600 text-white shadow-lg"
                style={{ transform: "rotate(-12deg)" }}
              >
                <span className="text-[8px] font-bold text-rose-100">부적효력</span>
                <span className="text-xs font-black leading-none">100%</span>
              </div>
            </div>

            <p className="px-2 text-xs leading-relaxed text-white/85">{preset.desc}</p>
            <div className="mt-2.5 w-full rounded-xl bg-black/25 px-3 py-2 text-xs font-bold text-amber-100">
              “{customNote.trim() || "오늘도 행운 가득한 하루 보내세요!"}”
            </div>
          </div>
        </div>

        {/* 4. 선물 액션 버튼 2종 */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={copyGiftLink}
            className="pill-btn flex w-full items-center justify-center gap-2 bg-gradient-to-r from-amber-300 to-amber-400 text-sm font-extrabold text-night-900 shadow-lg"
          >
            <span>💌</span>
            <span>부적 선물 링크 복사하기 (카톡·메신저 전송용)</span>
          </button>
          <button
            type="button"
            onClick={saveGiftImage}
            disabled={saving}
            className="pill-btn flex w-full items-center justify-center gap-2 border border-white/30 bg-white/10 text-sm text-white"
          >
            <span>📸</span>
            <span>{saving ? "부적 이미지 만드는 중…" : "부적 카드를 이미지로 저장하기"}</span>
          </button>
        </div>

        {previewUrl && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-5">
            <p className="mb-3 text-center text-sm">부적 이미지를 길게 눌러 저장해 주세요 📲</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="선물할 부적 이미지" className="max-h-[68dvh] rounded-2xl" />
            <button onClick={() => setPreviewUrl(null)} className="pill-btn mt-4 bg-white px-10 text-night-800">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex w-full max-w-[390px] flex-col items-center rounded-3xl border-2 border-amber-300/80 bg-gradient-to-b from-[#351970] to-[#170936] p-6 text-center text-white shadow-2xl"
      >
        <span className="rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-200">
          🎁 깜짝 행운 부적이 도착했어요!
        </span>
        <p className="mt-2 text-sm text-white/85">
          <strong className="text-amber-200">{fromName || "동료"}</strong>님이{" "}
          <strong className="text-white">{toName || "당신"}</strong>님에게 보낸 선물이에요
        </p>

        <h3 className="mt-2 text-xl font-black text-amber-100">🧧 {preset.name}</h3>

        <div className="my-3">
          <Owl src={preset.owlSrc} alt={preset.name} size={160} float priority />
        </div>

        <p className="text-xs leading-relaxed text-white/85">{preset.desc}</p>
        {note && (
          <div className="mt-3 w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-amber-200">
            “{note}”
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="pill-btn mt-5 w-full bg-brand text-base text-white shadow-lg shadow-brand/40"
        >
          부적 받고 나도 오늘의 운세 뽑기 🔮
        </button>
      </motion.div>
    </div>
  );
}
