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

export default function PickScreen({ name, cards, onSelect, onShuffle, onFlipped }: Props) {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<number | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const timers = useRef<number[]>([]);
  const doneRef = useRef(onFlipped);
  doneRef.current = onFlipped;

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const handleShuffle = () => {
    if (picked !== null || shuffling) return;
    setShuffling(true);
    setShuffleCount((c) => c + 1);
    onShuffle();
    timers.current.push(
      window.setTimeout(() => {
        setShuffling(false);
      }, reduce ? 150 : 700),
    );
  };

  const pick = (i: number) => {
    if (picked !== null || shuffling) return;
    setPicked(i);
    onSelect(i);
    // 터치(0.3s) → 뒤집기(0.9s) → 결과 전환
    timers.current.push(
      window.setTimeout(() => {
        setFlipped(true);
        if (isLucky(cards[i].fortune.mood) && !reduce) void fireConfetti();
        // TODO: 기획 확인 - 효과음/진동은 기본값(제외)으로 구현하지 않음
      }, reduce ? 100 : 350),
      window.setTimeout(() => doneRef.current(), reduce ? 700 : 2100),
    );
  };

  const selected = picked !== null ? cards[picked] : null;

  return (
    <div className="flex min-h-[100dvh] flex-col items-center px-5 pb-10 pt-10">
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
          key={shuffling ? "shuffling" : shuffleCount}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs text-purple-100/90 backdrop-blur"
        >
          {shuffling
            ? "수리수리… 별빛으로 카드를 섞고 있어요 ✨"
            : shuffleCount > 0
              ? `카드를 ${shuffleCount}번 새로 섞었어요! 이제 한 장을 골라보세요 🔮`
              : "마음이 끌리는 타로 카드를 한 장 터치해 보세요"}
        </motion.p>
      </motion.div>

      <div className="mt-auto flex w-full items-end justify-center gap-[3.5%] pb-5 pt-8">
        {cards.map((c, i) => (
          <Card
            key={i}
            index={i}
            color={c.frontColor}
            dimmed={picked !== null && picked !== i}
            disabled={picked !== null}
            shuffling={shuffling}
            onPick={() => pick(i)}
          />
        ))}
      </div>

      {/* 카드 섞기 버튼 */}
      <button
        type="button"
        onClick={handleShuffle}
        disabled={picked !== null || shuffling}
        className="mt-1 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-amber-200/45 bg-white/10 px-5 py-2 text-sm font-semibold text-amber-100 shadow-md backdrop-blur transition hover:bg-white/20 active:scale-95 disabled:opacity-40"
      >
        <span className={shuffling ? " inline-block animate-spin" : ""}>🔀</span>
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
                    : { scale: flipped ? 1.25 : 1.1, rotateY: flipped ? 180 : 0 }
                }
                transition={
                  flipped
                    ? { type: "spring", stiffness: 70, damping: 14, duration: 0.9 }
                    : { duration: 0.3, ease: "easeOut" }
                }
                className="relative h-[330px] w-[240px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="backface-hidden absolute inset-0">
                  {reduce && flipped ? (
                    <CardBack color={selected.fortune.cardColor} emoji={selected.fortune.hat} />
                  ) : (
                    <CardFront color={selected.frontColor} />
                  )}
                </div>
                <div className="backface-hidden absolute inset-0" style={{ transform: "rotateY(180deg)" }}>
                  <CardBack color={selected.fortune.cardColor} emoji={selected.fortune.hat} />
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
