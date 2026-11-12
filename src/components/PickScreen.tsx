"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Card, { CardBack, CardFront } from "./Card";
import Owl from "./Owl";
import { cardGlow } from "@/lib/colors";
import { isLucky } from "@/lib/fortune";
import type { DrawnCard } from "@/lib/types";

interface Props {
  name: string;
  cards: DrawnCard[];
  onSelect: (index: number) => void;
  onShuffle: () => void;
  onFlipped: () => void;
  onBackHome: () => void;
}

async function fireConfetti() {
  const confetti = (await import("canvas-confetti")).default;
  const end = Date.now() + 1600;
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.8 } });
    confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.8 } });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

const CHARGE_DURATION_MS = 780;

export default function PickScreen({ name, cards, onSelect, onShuffle, onFlipped, onBackHome }: Props) {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);

  // 기운 모으기(Long press charge) 상태
  const [chargingIdx, setChargingIdx] = useState<number | null>(null);
  const [charge, setCharge] = useState(0);
  const [hintMsg, setHintMsg] = useState<string | null>(null);

  const timers = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const chargeStartRef = useRef<number>(0);
  const lastTapRef = useRef<{ idx: number; time: number } | null>(null);
  const doneRef = useRef(onFlipped);
  doneRef.current = onFlipped;

  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stopChargeLoop = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const commitPick = (i: number) => {
    if (picked !== null) return;
    stopChargeLoop();
    setChargingIdx(null);
    setCharge(100);
    setPicked(i);
    onSelect(i);

    timers.current.push(
      window.setTimeout(() => {
        setFlipped(true);
        if (isLucky(cards[i].fortune.mood) && !reduce) void fireConfetti();
        // TODO: 기획 확인 - 효과음/진동은 기본값(제외)으로 구현하지 않음
      }, reduce ? 100 : 350),
      window.setTimeout(() => doneRef.current(), reduce ? 700 : 2100),
    );
  };

  const startCharge = (i: number) => {
    if (picked !== null || shuffling) return;
    if (reduce) {
      commitPick(i);
      return;
    }

    // 빠르게 두 번 탭한 경우 즉시 오픈
    const now = performance.now();
    if (lastTapRef.current && lastTapRef.current.idx === i && now - lastTapRef.current.time < 380) {
      commitPick(i);
      return;
    }
    lastTapRef.current = { idx: i, time: now };

    stopChargeLoop();
    setHintMsg(null);
    setChargingIdx(i);
    setCharge(8);
    chargeStartRef.current = now;

    const tick = (t: number) => {
      const elapsed = t - chargeStartRef.current;
      const pct = Math.min(100, 8 + (elapsed / CHARGE_DURATION_MS) * 92);
      setCharge(pct);
      if (pct >= 100) {
        commitPick(i);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const endCharge = (i: number, cancelled: boolean) => {
    if (picked !== null || chargingIdx !== i) return;
    stopChargeLoop();
    // 거의 다 모았으면(75% 이상) 그대로 오픈!
    if (!cancelled && charge >= 75) {
      commitPick(i);
      return;
    }
    setChargingIdx(null);
    setCharge(0);
    if (!cancelled) {
      setHintMsg("👆 카드를 1초간 꾹~ 누르고 있으면 행운 기운이 100% 충전되며 열려요! ✨");
    }
  };

  const handleShuffle = () => {
    if (picked !== null || shuffling) return;
    stopChargeLoop();
    setChargingIdx(null);
    setCharge(0);
    setHintMsg(null);
    setShuffling(true);
    setShuffleCount((c) => c + 1);
    onShuffle();
    timers.current.push(
      window.setTimeout(() => {
        setShuffling(false);
      }, reduce ? 150 : 700),
    );
  };

  const selected = picked !== null ? cards[picked] : null;

  const statusText = (() => {
    if (shuffling) return "수리수리… 별빛으로 카드를 섞고 있어요 ✨";
    if (chargingIdx !== null) {
      if (charge < 45) return `🔮 찌릿찌릿… 카드에 행운의 기운을 모으는 중! (${Math.round(charge)}%)`;
      if (charge < 85) return `✨ 칼퇴와 대박의 기운이 차오르고 있어요! (${Math.round(charge)}%)`;
      return "🌟 기운 충전 완료! 운명의 카드가 열립니다!";
    }
    if (hintMsg) return hintMsg;
    if (shuffleCount > 0) return `카드를 ${shuffleCount}번 새로 섞었어요! 마음에 드는 카드를 꾹 눌러보세요 🔮`;
    return "달·별·태양 부엉이 카드 중 하나를 1초간 꾹~ 눌러보세요 ✨";
  })();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-5 pb-10 pt-6">
      <div className="mb-2 flex w-full items-center justify-start">
        <button
          type="button"
          onClick={onBackHome}
          disabled={picked !== null}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition hover:bg-white/20 hover:text-white disabled:opacity-40"
        >
          <span>←</span>
          <span>첫 화면으로 (이름 변경)</span>
        </button>
      </div>

      <h2 className="text-center text-2xl font-extrabold leading-snug">
        {name}님,
        <br />
        오늘의 카드를 골라보세요
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-5 flex flex-col items-center"
      >
        <Owl
          src="/assets/owl/fortune-teller-owl.png"
          hat="🔮"
          prop="✨"
          alt="수정구슬을 든 점술가 부엉이"
          size={165}
          float
        />
        <motion.p
          key={chargingIdx !== null ? "charging" : statusText}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 rounded-full border px-3.5 py-1.5 text-center text-xs backdrop-blur transition-colors ${
            chargingIdx !== null
              ? "border-amber-300/70 bg-amber-400/20 font-bold text-amber-100"
              : "border-white/15 bg-white/10 text-purple-100/90"
          }`}
        >
          {statusText}
        </motion.p>
      </motion.div>

      <div className="mt-auto flex w-full items-end justify-center gap-[3.5%] pb-4 pt-8">
        {cards.map((c, i) => (
          <Card
            key={i}
            index={i}
            color={c.frontColor}
            variant={c.tarotVariant}
            dimmed={
              (picked !== null && picked !== i) ||
              (chargingIdx !== null && chargingIdx !== i)
            }
            disabled={picked !== null}
            shuffling={shuffling}
            charge={chargingIdx === i ? charge : 0}
            onChargeStart={() => startCharge(i)}
            onChargeEnd={(cancelled) => endCharge(i, cancelled)}
          />
        ))}
      </div>

      {/* 기운 모으기 게이지 바 */}
      <div className="mb-3 h-2 w-48 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${chargingIdx !== null ? charge : 0}%`,
            background: "linear-gradient(90deg, #a97bff 0%, #ffd86b 55%, #fff5cc 100%)",
            boxShadow: chargingIdx !== null ? "0 0 12px #ffd86b" : "none",
          }}
        />
      </div>

      {/* 카드 섞기 버튼 */}
      <button
        type="button"
        onClick={handleShuffle}
        disabled={picked !== null || shuffling || chargingIdx !== null}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-amber-200/45 bg-white/10 px-5 py-2 text-sm font-semibold text-amber-100 shadow-md backdrop-blur transition hover:bg-white/20 active:scale-95 disabled:opacity-40"
      >
        <span className={shuffling ? "inline-block animate-spin" : ""}>🔀</span>
        <span>{shuffling ? "카드 섞는 중…" : "카드 다시 섞기"}</span>
      </button>

      {/* 카드 뒤집기 연출: 선택한 카드가 중앙으로 이동하며 3D 회전 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="flip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-night-900/85 backdrop-blur-sm"
          >
            <div className="card-3d">
              <motion.div
                initial={{ scale: 0.6, rotateY: 0 }}
                animate={
                  reduce
                    ? { scale: 1 }
                    : { scale: flipped ? 1.22 : 1.08, rotateY: flipped ? 180 : 0 }
                }
                transition={
                  flipped
                    ? { type: "spring", stiffness: 70, damping: 14, duration: 0.9 }
                    : { duration: 0.3, ease: "easeOut" }
                }
                className="relative h-[340px] w-[245px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="backface-hidden absolute inset-0">
                  {reduce && flipped ? (
                    <CardBack fortune={selected.fortune} />
                  ) : (
                    <CardFront
                      color={selected.frontColor}
                      variant={selected.tarotVariant}
                      charge={100}
                    />
                  )}
                </div>
                <div className="backface-hidden absolute inset-0" style={{ transform: "rotateY(180deg)" }}>
                  <CardBack fortune={selected.fortune} />
                </div>
              </motion.div>
            </div>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.4, 2.4, 3] }}
                transition={{ duration: 0.9 }}
                className="pointer-events-none absolute h-48 w-48 rounded-full"
                style={{ background: `radial-gradient(circle, ${cardGlow(selected.fortune.cardColor)}, transparent 70%)` }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
