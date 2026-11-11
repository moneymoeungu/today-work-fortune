"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroScreen from "@/components/IntroScreen";
import PickScreen from "@/components/PickScreen";
import ResultScreen from "@/components/ResultScreen";
import StarField from "@/components/StarField";
import { buildResult, drawCards, FORTUNES } from "@/lib/fortune";
import { addToHistory, getTodayHistory, loadProfile, saveProfile, type Profile } from "@/lib/storage";
import { track } from "@/lib/analytics";
import { assetUrl } from "@/lib/asset";
import type { DrawnCard, FortuneResult } from "@/lib/types";

type Step = "intro" | "pick" | "result";

const slide = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, y: -40, transition: { duration: 0.35 } },
};

function preloadImages(urls: string[]) {
  if (typeof window === "undefined") return;
  urls.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.src = assetUrl(src);
  });
}

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [profile, setProfile] = useState<Profile>({ name: "", team: "" });
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile(saved);
    setCollected(getTodayHistory());
    track("start");

    // 1순위: 인트로/점술가 부엉이 즉시 로딩
    preloadImages(["/assets/owl/fortune-teller-owl.png"]);

    // 2순위: 첫 화면 렌더링 이후 유휴 시간에 결과 부엉이 12종 전체 사전 로딩 (PRD 8.2)
    const timer = window.setTimeout(() => {
      preloadImages(FORTUNES.map((f) => f.characterImage));
    }, 800);

    return () => window.clearTimeout(timer);
  }, []);

  const startPick = (p: Profile) => {
    saveProfile(p);
    setProfile(p);
    track("input_complete");
    const nextCards = drawCards(lastId.current);
    preloadImages(nextCards.map((c) => c.fortune.characterImage));
    setCards(nextCards);
    setStep("pick");
  };

  const shuffleCards = () => {
    const nextCards = drawCards(lastId.current);
    preloadImages(nextCards.map((c) => c.fortune.characterImage));
    setCards(nextCards);
  };

  const onSelect = (index: number) => {
    const picked = cards[index];
    track("card_select", { fortune: picked.fortune.id });
    const r = buildResult(picked.fortune, profile.name, profile.team);
    lastId.current = picked.fortune.id;
    setCollected(addToHistory(picked.fortune.id));
    setResult(r);
  };

  const showResult = () => {
    setStep("result");
    if (result) track("result_view", { fortune: result.fortune.id });
  };

  const retry = () => {
    track("retry");
    const nextCards = drawCards(lastId.current);
    preloadImages(nextCards.map((c) => c.fortune.characterImage));
    setCards(nextCards);
    setResult(null);
    setStep("pick");
  };

  const editName = () => {
    setResult(null);
    setStep("intro");
  };

  return (
    <main className="bg-night relative mx-auto min-h-[100dvh] w-full max-w-[480px] overflow-hidden">
      <StarField />
      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div key="intro" {...slide} className="relative z-10 min-h-[100dvh]">
            <IntroScreen initial={profile} onSubmit={startPick} />
          </motion.div>
        )}
        {step === "pick" && (
          <motion.div key="pick" {...slide} className="relative z-10 min-h-[100dvh]">
            <PickScreen
              name={profile.name}
              cards={cards}
              onSelect={onSelect}
              onShuffle={shuffleCards}
              onFlipped={showResult}
            />
          </motion.div>
        )}
        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-[100dvh]"
          >
            <ResultScreen
              result={result}
              collectedCount={new Set(collected).size}
              collectedIds={Array.from(new Set(collected))}
              total={FORTUNES.length}
              onRetry={retry}
              onEditName={editName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
