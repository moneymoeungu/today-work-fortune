"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MysticTitle from "./MysticTitle";
import Owl from "./Owl";
import type { Profile } from "@/lib/storage";

interface Props {
  initial: Profile;
  onSubmit: (p: Profile) => void;
}

export default function IntroScreen({ initial, onSubmit }: Props) {
  const [name, setName] = useState(initial.name);
  const [team, setTeam] = useState(initial.team);
  const [touched, setTouched] = useState({ name: false, team: false });

  const nameTrim = name.trim();
  const teamTrim = team.trim();
  const nameError = touched.name && !nameTrim ? "이름을 입력해 주세요" : "";
  const teamError = touched.team && !teamTrim ? "팀 이름을 입력해 주세요" : "";
  const valid = !!nameTrim && !!teamTrim;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, team: true });
    if (valid) onSubmit({ name: nameTrim, team: teamTrim });
  };

  return (
    <form onSubmit={submit} className="flex min-h-[100dvh] flex-col px-5 pb-6 pt-8">
      <header className="text-center">
        <MysticTitle />
        <p className="mt-1 text-[14px] text-blue-100/80">
          부엉이가 오늘의 업무 운세를 알려줄게요
        </p>
      </header>

      <div className="relative my-4 flex flex-1 flex-col items-center justify-center">
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 12, duration: 0.8 }}
        >
          <Owl src="/assets/owl/fortune-teller-owl.png" alt="운세를 봐주는 점술가 부엉이" size={205} float priority />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-3 rounded-2xl border border-white/15 bg-white/15 px-4 py-2 text-sm backdrop-blur"
        >
          안녕하세요! 이름과 팀을 알려주세요 🔮
        </motion.div>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="name" className="sr-only">
            이름
          </label>
          <input
            id="name"
            value={name}
            maxLength={10}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            placeholder="이름을 입력해 주세요"
            aria-invalid={!!nameError}
            className="h-[52px] w-full rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/50 focus:border-white/70 focus:outline-none"
          />
          {nameError && <p className="mt-1 px-2 text-sm text-pink-300">{nameError}</p>}
        </div>
        <div>
          <label htmlFor="team" className="sr-only">
            팀 이름
          </label>
          <input
            id="team"
            value={team}
            maxLength={15}
            autoComplete="off"
            onChange={(e) => setTeam(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, team: true }))}
            placeholder="예) 마케팅팀"
            aria-invalid={!!teamError}
            className="h-[52px] w-full rounded-2xl border border-white/20 bg-white/10 px-4 text-base text-white placeholder:text-white/50 focus:border-white/70 focus:outline-none"
          />
          {teamError && <p className="mt-1 px-2 text-sm text-pink-300">{teamError}</p>}
        </div>
      </div>

      <button type="submit" disabled={!valid} className="pill-btn mt-5 w-full bg-brand text-lg text-white shadow-lg shadow-brand/40">
        카드 뽑으러 가기
      </button>
      <p className="mt-3 text-center text-xs text-white/60">입력한 정보는 저장되지 않고 이 기기에서만 사용돼요</p>
    </form>
  );
}
