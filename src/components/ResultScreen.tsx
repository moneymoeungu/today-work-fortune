"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Owl from "./Owl";
import ShareCard from "./ShareCard";
import { TalismanGiftModal } from "./TalismanGiftModal";
import { cardGlow } from "@/lib/colors";
import { FORTUNES } from "@/lib/fortune";
import { track } from "@/lib/analytics";
import type { FortuneResult } from "@/lib/types";

interface Props {
  result: FortuneResult;
  collectedCount: number;
  collectedIds: string[];
  total: number;
  onRetry: () => void;
  onEditName: () => void;
}

const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

const OWL_REACTIONS = [
  "부엉! 오늘 하루도 응원해요 ✨",
  "행운의 기운을 팍팍 보내드릴게요 🔮",
  "칼퇴와 보너스가 함께하길! 🍀",
  "오늘 가장 빛나는 주인공은 바로 당신이에요 🌟",
  "쓰담쓰담 고마워요! 좋은 일만 생길 거예요 🦉",
];

export default function ResultScreen({
  result,
  collectedCount,
  collectedIds,
  total,
  onRetry,
  onEditName,
}: Props) {
  const reduce = useReducedMotion();
  const {
    fortune,
    scores,
    luckyLunch,
    luckyDrink,
    goldenTime,
    bestPartner,
    tabooAction,
    onTimeLeaveRate,
    talismanTitle,
  } = result;
  const glow = cardGlow(fortune.cardColor);
  const exportRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [petIdx, setPetIdx] = useState<number | null>(null);
  const [giftOpen, setGiftOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  // 순차(stagger) 등장: 위에서 아래로
  const item = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 + i * 0.14, duration: 0.5, ease: "easeOut" as const },
  });

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.origin + window.location.pathname;
  };

  const makePng = async (): Promise<string> => {
    const { toPng } = await import("html-to-image");
    const node = exportRef.current!;
    const opts = { width: 1080, height: 1920, pixelRatio: 1, cacheBust: true };
    try {
      return await toPng(node, opts);
    } catch {
      return await toPng(node, { ...opts, skipFonts: true });
    }
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    track("image_save", { fortune: fortune.id });
    try {
      const dataUrl = await makePng();
      const ua = navigator.userAgent;
      const needsLongPress = /KAKAOTALK|iPhone|iPad|iPod/i.test(ua);
      if (needsLongPress) {
        setPreviewUrl(dataUrl);
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `오늘의-업무-운세-${result.name}.png`;
        a.click();
        showToast("내 운세 부적 카드를 이미지로 저장했어요 📸");
      }
    } catch {
      showToast("저장에 실패했어요. 화면을 캡처해 주세요");
    } finally {
      setSaving(false);
    }
  };

  const shareResult = async () => {
    track("share_click", { fortune: fortune.id });
    const url = getShareUrl();
    const text = `${result.team} ${result.name}님의 오늘 업무 운세는 「${fortune.title}」! (칼퇴 확률 ${onTimeLeaveRate}%)\n🍽️ 행운 점심: ${luckyLunch.menu}\n☕ 수혈 음료: ${luckyDrink}\n당신의 오늘 업무 운세도 뽑아보세요 👇`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "오늘의 업무 운세", text, url });
        return;
      }
      throw new Error("no-share");
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        showToast("내 운세 결과와 링크를 복사했어요! 메신저에 붙여넣어 보세요 ✨");
      } catch {
        showToast("링크 복사에 실패했어요");
      }
    }
  };

  const copyInviteLink = async () => {
    track("share_click", { fortune: fortune.id, type: "invite_link" });
    const url = getShareUrl();
    const inviteText = `🔮 [오늘의 업무 운세] 부엉이가 알려주는 내 오늘의 업무 타로는?\n나는 「${fortune.title}」 (칼퇴 확률 ${onTimeLeaveRate}% · 행운 점심: ${luckyLunch.menu}) 나왔어! 너도 10초 만에 뽑아봐 👇\n${url}`;
    try {
      await navigator.clipboard.writeText(inviteText);
      showToast("동료에게 보낼 추천 링크가 복사되었어요! 단체방에 붙여넣어 보세요 🔗");
    } catch {
      showToast("링크 복사에 실패했어요");
    }
  };

  const handlePetOwl = () => {
    setPetIdx((prev) => (prev === null ? 0 : (prev + 1) % OWL_REACTIONS.length));
  };

  const rows: [string, number][] = [
    ["집중력", scores.focus],
    ["협업운", scores.teamwork],
    ["소통운", scores.communication],
  ];

  return (
    <div
      className="relative min-h-[100dvh] px-5 pb-44 pt-8"
      style={{ background: `radial-gradient(90% 45% at 50% 22%, ${glow}44 0%, transparent 70%)` }}
    >
      {/* 상단: 4번 행운 수호 부적 캡슐 배지 + 타이틀 */}
      <motion.div {...item(0)} className="flex flex-col items-center text-center">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-amber-400/15 px-3.5 py-1 text-xs font-bold text-amber-200 shadow-sm backdrop-blur">
          <span>🧧</span>
          <span>오늘의 부엉이 부적 · {talismanTitle}</span>
        </span>
        <p className="text-sm text-white/80">
          {result.team} {result.name}님은
        </p>
        <h1 className="mt-1 text-[27px] font-extrabold leading-tight">{fortune.title}</h1>
      </motion.div>

      {/* 중앙: 3D 부엉이 + 3번 칼퇴 확률 결재 승인 도장(오버레이 스탬프) */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
        className="my-4 flex flex-col items-center"
      >
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={handlePetOwl}
            aria-label="부엉이 쓰다듬기"
            className="group relative transition-transform active:scale-95"
          >
            <Owl
              src={fortune.characterImage}
              hat={fortune.hat}
              prop={fortune.prop}
              alt={`${fortune.title} 부엉이`}
              size={220}
              float
              priority
            />
          </button>

          {/* 3번: 정시퇴근(칼퇴) 확률 결재 도장 배지 */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.8, rotate: -28 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.65 }}
            className="pointer-events-none absolute -right-4 bottom-2 z-20 flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full border-2 border-rose-300/90 bg-gradient-to-br from-rose-500/90 to-red-700/90 text-center shadow-[0_6px_20px_rgba(244,63,94,0.55)] backdrop-blur-sm"
          >
            <div className="flex h-[68px] w-[68px] flex-col items-center justify-center rounded-full border border-dashed border-rose-200/80">
              <span className="text-[9px] font-bold tracking-wider text-rose-100">칼퇴확률</span>
              <span className="text-[19px] font-black leading-none text-white">{onTimeLeaveRate}%</span>
              <span className="mt-0.5 text-[8px] font-bold tracking-widest text-amber-200">✦ 승인완료 ✦</span>
            </div>
          </motion.div>
        </div>

        <p className="mt-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-amber-100/90 backdrop-blur">
          {petIdx !== null ? OWL_REACTIONS[petIdx] : "👆 부엉이를 톡 터치하면 행운의 한마디를 해줘요"}
        </p>
      </motion.div>

      <div className="space-y-3">
        {/* 카드 1: 핵심 3줄 */}
        <motion.section {...item(2)} className="space-y-2.5 rounded-3xl bg-white/15 p-5 backdrop-blur">
          {fortune.lines.map((l, i) => (
            <p key={i} className="flex items-start gap-3 text-[15px] leading-snug">
              <span className="text-xl">{l.icon}</span>
              <span className="pt-0.5">{l.text}</span>
            </p>
          ))}
        </motion.section>

        {/* 카드 2: 업무 지수(가로 3칸 압축) + 2×2 벤토 그리드(업무템/골든타임/점심/음료) + 귀인/주의보 */}
        <motion.section {...item(3)} className="rounded-3xl bg-white/15 p-4 backdrop-blur">
          {/* 가로 3열 업무 지수 바 */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-black/20 p-2.5 text-center">
            {rows.map(([label, v]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-white/75">{label}</span>
                <span aria-label={`${v}점 / 5점`} className="mt-0.5 text-xs tracking-wider text-yellow-300">
                  {stars(v)}
                </span>
              </div>
            ))}
          </div>

          {/* 2×2 벤토 그리드: 행운템 / 골든타임 / 행운 점심 / 수혈 음료(2번) */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-semibold text-white/65">🍀 행운의 업무템</p>
              <p className="mt-1 text-[13.5px] font-bold leading-snug text-amber-100">{fortune.luckyItem}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-semibold text-white/65">⏰ 업무 골든타임</p>
              <p className="mt-1 text-[13.5px] font-bold leading-snug text-sky-200">{goldenTime}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-semibold text-white/65">🍽️ 오늘의 행운 점심</p>
              <p className="mt-1 text-[13.5px] font-bold leading-snug text-amber-200">{luckyLunch.menu}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3">
              <p className="text-[11px] font-semibold text-white/65">☕ 영혼 수혈 음료</p>
              <p className="mt-1 text-[13.5px] font-bold leading-snug text-emerald-200">{luckyDrink}</p>
            </div>
          </div>

          {/* 하단 2줄 포인트: 오늘의 귀인 동료 & 1번 오늘의 업무 주의보(금지어) */}
          <div className="mt-2.5 space-y-1.5 rounded-2xl bg-black/15 px-3.5 py-2.5 text-[13px]">
            <p className="flex items-start gap-2 leading-snug">
              <span className="shrink-0 font-bold text-pink-200">🤝 찰떡 동료</span>
              <span className="text-white/90">{bestPartner}</span>
            </p>
            <p className="flex items-start gap-2 border-t border-white/10 pt-1.5 leading-snug">
              <span className="shrink-0 font-bold text-rose-300">🚫 주의할 것</span>
              <span className="text-white/90">{tabooAction}</span>
            </p>
          </div>
        </motion.section>

        {/* 카드 3: 팀 맞춤 한마디 + 응원 메시지 */}
        <motion.section {...item(4)} className="rounded-3xl bg-white/15 p-5 backdrop-blur">
          <p className="text-[15px] leading-snug">💼 {result.teamLine}</p>
          <p className="mt-2.5 text-[15px] font-bold leading-snug text-amber-100">“{fortune.message}”</p>
        </motion.section>

        {/* 동료에게 부적 선물하기 & 공유하기 전용 섹션 */}
        <motion.section
          {...item(5)}
          className="rounded-3xl border border-amber-200/35 bg-gradient-to-br from-brand/35 to-purple-900/40 p-5 backdrop-blur"
        >
          <p className="text-center text-sm font-bold text-amber-100">
            🎁 팀 동료에게 행운을 나눠보세요!
          </p>
          <p className="mt-1 text-center text-xs text-white/75">
            동료 이름을 넣어 맞춤 부엉이 부적을 선물하거나 운세 링크를 공유할 수 있어요
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setGiftOpen(true)}
              className="pill-btn flex w-full items-center justify-center gap-2 bg-gradient-to-r from-amber-300 to-amber-400 text-[15px] font-extrabold text-night-900 shadow-lg"
            >
              <span>🧧</span>
              <span>동료에게 부엉이 부적 한 장 선물하기</span>
            </button>
            <button
              type="button"
              onClick={copyInviteLink}
              className="pill-btn flex w-full items-center justify-center gap-2 border border-white/25 bg-white/15 text-[14px] text-white"
            >
              <span>🔗</span>
              <span>다른 사람도 해보게 공유 링크만 복사하기</span>
            </button>
          </div>
        </motion.section>

        {/* 12종 부엉이 도감 */}
        <motion.section {...item(6)} className="rounded-3xl bg-white/10 p-4">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold text-white/90">
              🦉 부엉이 캐릭터 도감 ({collectedCount}/{total}종 발견)
            </p>
            <p className="mt-0.5 text-[11px] text-white/60">
              총 12가지 코스튬의 운세 부엉이가 숨어 있어요! 다시 뽑기로 모아보세요
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {FORTUNES.map((f) => {
              const got = collectedIds.includes(f.id);
              return (
                <span
                  key={f.id}
                  title={got ? f.title : "아직 만나지 못한 부엉이예요"}
                  className={`rounded-full px-2.5 py-1 text-[11px] ${
                    got
                      ? "bg-white/90 font-semibold text-night-800"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {got ? `${f.hat} ${f.title}` : "🔒 미발견"}
                </span>
              );
            })}
          </div>
        </motion.section>
      </div>

      <motion.div {...item(7)} className="mt-6 flex flex-col items-center gap-2.5">
        <button onClick={onRetry} className="pill-btn w-full border-2 border-white/60 bg-white/10 text-lg text-white">
          🔄 카드 다시 뽑기
        </button>
        <button
          onClick={onEditName}
          className="pill-btn w-full border border-white/25 bg-white/5 text-sm font-semibold text-white/80 hover:bg-white/15"
        >
          🏠 첫 화면으로 돌아가기 (이름·팀명 변경)
        </button>
        <p className="mt-1 text-center text-xs text-white/50">재미로 보는 운세예요. 오늘도 힘내세요!</p>
      </motion.div>

      {/* 하단 고정 버튼: 내 운세 이미지 저장 + 내 결과 공유 */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[480px] gap-3 bg-gradient-to-t from-night-900 via-night-900/95 to-transparent px-5 pb-5 pt-8">
        <button onClick={save} disabled={saving} className="pill-btn flex-1 bg-gray-100 text-[15px] text-night-800 shadow-lg">
          {saving ? "부적 만드는 중…" : "📸 부적 이미지 저장"}
        </button>
        <button onClick={shareResult} className="pill-btn flex-1 bg-brand text-[15px] text-white shadow-lg shadow-brand/40">
          📤 내 운세 공유하기
        </button>
      </div>

      {toast && (
        <div role="status" className="fixed inset-x-0 bottom-28 z-40 mx-auto w-fit max-w-[90%] rounded-full bg-black/85 px-5 py-3 text-center text-sm shadow-xl">
          {toast}
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-5">
          <p className="mb-3 text-center text-sm">이미지를 길게 눌러 저장해 주세요 📲</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="저장할 운세 이미지" className="max-h-[70dvh] rounded-2xl" />
          <button onClick={() => setPreviewUrl(null)} className="pill-btn mt-4 bg-white px-10 text-night-800">
            닫기
          </button>
        </div>
      )}

      {giftOpen && (
        <TalismanGiftModal
          senderName={result.name}
          senderTeam={result.team}
          onClose={() => setGiftOpen(false)}
          onToast={showToast}
        />
      )}

      {/* 이미지 저장용 (화면 밖) */}
      <div aria-hidden style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }}>
        <div ref={exportRef}>
          <ShareCard result={result} url={getShareUrl()} />
        </div>
      </div>
    </div>
  );
}
