"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Owl from "./Owl";
import ShareCard from "./ShareCard";
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

export default function ResultScreen({ result, collectedCount, collectedIds, total, onRetry, onEditName }: Props) {
  const reduce = useReducedMotion();
  const { fortune, scores, luckyLunch, goldenTime, bestPartner } = result;
  const glow = cardGlow(fortune.cardColor);
  const exportRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [petIdx, setPetIdx] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  // 순차(stagger) 등장: 위에서 아래로
  const item = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2 + i * 0.15, duration: 0.5, ease: "easeOut" as const },
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
      // 웹폰트를 읽지 못해도 이미지는 저장되게 한다.
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
        // 카카오톡 인앱/iOS는 자동 다운로드가 막히는 경우가 있어 길게 눌러 저장 안내
        setPreviewUrl(dataUrl);
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `오늘의-업무-운세-${result.name}.png`;
        a.click();
        showToast("내 운세 카드 이미지를 저장했어요 📸");
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
    const text = `${result.team} ${result.name}님의 오늘 업무 운세는 「${fortune.title}」! 🦉\n🍽️ 행운 점심: ${luckyLunch.menu}\n⏰ 골든타임: ${goldenTime}\n당신의 오늘 업무 운세도 뽑아보세요 👇`;
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
    const inviteText = `🔮 [오늘의 업무 운세] 부엉이가 알려주는 내 오늘의 업무 타로는?\n나는 「${fortune.title}」 (행운 점심: ${luckyLunch.menu}) 나왔어! 너도 10초 만에 뽑아봐 👇\n${url}`;
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
      className="relative min-h-[100dvh] px-5 pb-44 pt-9"
      style={{ background: `radial-gradient(90% 45% at 50% 22%, ${glow}44 0%, transparent 70%)` }}
    >
      <motion.div {...item(0)} className="text-center">
        <p className="text-sm text-white/80">
          {result.team} {result.name}님은
        </p>
        <h1 className="mt-1 text-[28px] font-extrabold leading-tight">{fortune.title}</h1>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
        className="my-5 flex flex-col items-center"
      >
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
            size={225}
            float
            priority
          />
        </button>
        <p className="mt-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-amber-100/90 backdrop-blur">
          {petIdx !== null ? OWL_REACTIONS[petIdx] : "👆 부엉이를 톡 터치하면 행운의 한마디를 해줘요"}
        </p>
      </motion.div>

      <div className="space-y-3">
        <motion.section {...item(2)} className="space-y-3 rounded-3xl bg-white/15 p-5 backdrop-blur">
          {fortune.lines.map((l, i) => (
            <p key={i} className="flex items-start gap-3 text-[15px] leading-snug">
              <span className="text-xl">{l.icon}</span>
              <span className="pt-0.5">{l.text}</span>
            </p>
          ))}
        </motion.section>

        <motion.section {...item(3)} className="rounded-3xl bg-white/15 p-5 backdrop-blur">
          <h2 className="mb-3 text-sm font-bold text-white/80">오늘의 업무 지수 & 행운 가이드</h2>
          {rows.map(([label, v]) => (
            <div key={label} className="mb-2 flex items-center justify-between text-[15px]">
              <span>{label}</span>
              <span aria-label={`${v}점 / 5점`} className="tracking-widest text-yellow-300">
                {stars(v)}
              </span>
            </div>
          ))}
          <div className="mt-3 space-y-2 border-t border-white/15 pt-3 text-[14px]">
            <p>🍀 행운의 업무템: <span className="font-semibold text-amber-100">{fortune.luckyItem}</span></p>
            <p>⏰ 업무 골든타임: <span className="font-semibold text-sky-200">{goldenTime}</span></p>
            <p>🤝 오늘의 귀인 동료: <span className="font-semibold text-pink-200">{bestPartner}</span></p>
            <div className="mt-2 rounded-2xl bg-white/10 px-3.5 py-2.5">
              <p className="font-bold text-amber-200">🍽️ 오늘의 행운 점심: {luckyLunch.menu}</p>
              <p className="mt-0.5 text-xs text-white/80">{luckyLunch.tip}</p>
            </div>
          </div>
        </motion.section>

        <motion.section {...item(4)} className="rounded-3xl bg-white/15 p-5 backdrop-blur">
          <p className="text-[15px] leading-snug">💼 {result.teamLine}</p>
          <p className="mt-3 text-[15px] font-bold leading-snug">“{fortune.message}”</p>
        </motion.section>

        {/* 동료에게 해보라고 공유하기 전용 섹션 */}
        <motion.section
          {...item(5)}
          className="rounded-3xl border border-amber-200/35 bg-gradient-to-br from-brand/35 to-purple-900/40 p-5 backdrop-blur"
        >
          <p className="text-center text-sm font-bold text-amber-100">
            💌 팀 동료에게도 해보라고 공유해 보세요!
          </p>
          <p className="mt-1 text-center text-xs text-white/75">
            아래 버튼을 누르면 메신저·단톡방에 바로 붙여넣을 수 있는 초대 링크가 복사돼요
          </p>
          <button
            type="button"
            onClick={copyInviteLink}
            className="pill-btn mt-3 flex w-full items-center justify-center gap-2 bg-white text-[15px] text-night-800 shadow-md"
          >
            <span>🔗</span>
            <span>다른 사람도 해보게 공유 링크 복사하기</span>
          </button>
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

      <motion.div {...item(7)} className="mt-6 flex flex-col items-center gap-3">
        <button onClick={onRetry} className="pill-btn w-full border-2 border-white/60 bg-white/10 text-lg text-white">
          🔄 카드 다시 뽑기
        </button>
        <button onClick={onEditName} className="min-h-[44px] text-sm text-white/70 underline underline-offset-4">
          이름/팀명 바꾸기
        </button>
        <p className="text-center text-xs text-white/50">재미로 보는 운세예요. 오늘도 힘내세요!</p>
      </motion.div>

      {/* 하단 고정 버튼: 내 운세 이미지 저장 + 내 결과 공유 */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[480px] gap-3 bg-gradient-to-t from-night-900 via-night-900/95 to-transparent px-5 pb-5 pt-8">
        <button onClick={save} disabled={saving} className="pill-btn flex-1 bg-gray-100 text-[15px] text-night-800 shadow-lg">
          {saving ? "이미지 만드는 중…" : "📸 카드로 이미지 저장"}
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

      {/* 이미지 저장용 (화면 밖) */}
      <div aria-hidden style={{ position: "fixed", left: -10000, top: 0, pointerEvents: "none" }}>
        <div ref={exportRef}>
          <ShareCard result={result} url={getShareUrl()} />
        </div>
      </div>
    </div>
  );
}
