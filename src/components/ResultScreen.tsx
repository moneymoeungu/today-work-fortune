"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CloverBoostCard from "./CloverBoostCard";
import { getFortuneCardMeta, LuckyTalismanCard, MyLuckyCardModal } from "./LuckyTalismanCard";
import { TalismanGiftModal } from "./TalismanGiftModal";
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

export default function ResultScreen({
  result,
  collectedCount,
  collectedIds,
  total,
  onRetry,
  onEditName,
}: Props) {
  const reduce = useReducedMotion();
  const [toast, setToast] = useState<string | null>(null);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [cloverBoosted, setCloverBoosted] = useState(false);
  const [myCardOpen, setMyCardOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const {
    fortune,
    scores,
    luckyLunch,
    luckyDrink,
    goldenTime,
    bestPartner,
    tabooAction,
    onTimeLeaveRate,
  } = result;

  const cardMeta = getFortuneCardMeta(fortune.id);
  const effectiveLeaveRate = cloverBoosted ? Math.min(99, onTimeLeaveRate + 12) : onTimeLeaveRate;

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const item = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.12 + i * 0.08, duration: 0.38, ease: "easeOut" },
        };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const getShareUrl = () =>
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "https://moneymoeungu.github.io/today-work-fortune/";

  const shareResult = async () => {
    track("share_click", { fortune: fortune.id, type: "my_result" });
    const url = getShareUrl();
    const title = "오늘의 업무 운세, 당신의 카드는?";
    const text = `🦉 ${result.team} ${result.name}님의 오늘의 업무 운세는 「${fortune.title}」!\n(${cardMeta.line1} ${cardMeta.line2})\n\n👇 당신의 오늘 업무 운세도 뽑아보세요`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      showToast("내 운세 결과와 링크가 복사되었어요! 💌");
    } catch {
      showToast("공유 링크 복사에 실패했어요");
    }
  };

  const copyInviteLink = async () => {
    track("share_click", { fortune: fortune.id, type: "invite_link" });
    const url = getShareUrl();
    const inviteText = `🔮 [오늘의 업무 운세]\n카드를 한 장 뽑으면 부엉이가 오늘의 업무 운세와 행운 점심 메뉴를 알려줘요! 🦉✨\n\n👉 지금 바로 뽑아보기: ${url}`;
    try {
      await navigator.clipboard.writeText(inviteText);
      showToast("공유 링크가 복사되었어요! 동료에게 붙여넣어 보세요");
    } catch {
      showToast("링크 복사에 실패했어요");
    }
  };

  const toggleOwlBubble = () => {
    setBubbleOpen((prev) => !prev);
  };

  const metricRows: { label: string; score: number; pct: number }[] = [
    { label: "집중력", score: scores.focus, pct: scores.focus * 20 },
    { label: "협업운", score: scores.teamwork, pct: scores.teamwork * 20 },
    { label: "소통운", score: scores.communication, pct: scores.communication * 20 },
  ];

  return (
    <div className="relative min-h-[100dvh] px-5 pb-40 pt-8">
      {/* 상단 타이틀 헤더 (최상단 라운드바 제거) */}
      <motion.div {...item(0)} className="mb-5 flex flex-col items-center text-center">
        <p className="text-[14px] font-medium text-white/75">
          {month}월 {day}일 {result.team} {result.name}님은
        </p>
        <h1 className="mt-1 text-[26px] font-extrabold leading-snug tracking-tight text-white">
          {fortune.title}
        </h1>
      </motion.div>

      {/* 히어로: 밤하늘 보라색 톤 행운 카드 + 부엉이 터치 시 말풍선 ON/OFF */}
      <motion.div {...item(1)} className="mb-6 flex flex-col items-center">
        <LuckyTalismanCard
          badgeText="오늘의 행운 카드"
          owlSrc={fortune.characterImage}
          line1={cardMeta.line1}
          line2={cardMeta.line2}
          subText={`정시퇴근 확률 ${effectiveLeaveRate}% · ${result.talismanTitle}`}
          themeKey={cardMeta.themeKey}
          speechBubble={bubbleOpen ? cardMeta.owlAdvice : null}
          onClickOwl={toggleOwlBubble}
        />
        <button
          type="button"
          onClick={toggleOwlBubble}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-purple-200/15 bg-white/[0.07] px-3.5 py-1 text-[11.5px] font-medium text-purple-100/80 backdrop-blur transition hover:bg-white/[0.12] hover:text-white"
        >
          <span className="text-[10px] text-[#f3dc99]">✦</span>
          <span>
            {bubbleOpen
              ? "부엉이를 다시 누르면 말풍선이 닫혀요"
              : "카드 속 부엉이를 누르면 오늘의 한마디가 나와요"}
          </span>
        </button>
      </motion.div>

      <div className="space-y-3.5">
        {/* 섹션 1: 오늘의 업무 흐름 */}
        <motion.section
          {...item(2)}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.06] p-6 backdrop-blur-md"
        >
          <p className="text-[12px] font-semibold tracking-tight text-white/55">오늘의 업무 흐름</p>
          <div className="mt-3.5 space-y-3">
            {fortune.lines.map((l, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-white/75">
                  {i + 1}
                </span>
                <p className="text-[14.5px] font-medium leading-relaxed text-white/90">{l.text}</p>
              </div>
            ))}
          </div>

          {/* 업무 컨디션 지표 바 */}
          <div className="mt-5 border-t border-white/[0.08] pt-4">
            <div className="grid grid-cols-3 gap-3">
              {metricRows.map((m) => (
                <div key={m.label} className="rounded-2xl bg-black/20 p-3">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-medium text-white/60">{m.label}</span>
                    <span className="font-bold text-white/90">{m.score}.0</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-amber-300"
                      style={{ width: `${m.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 정시퇴근 확률 바 */}
            <div className="mt-2.5 flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3">
              <span className="text-[12.5px] font-medium text-white/65">오늘의 정시퇴근 확률</span>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-extrabold text-emerald-300">{effectiveLeaveRate}%</span>
                {cloverBoosted && (
                  <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    +12% UP
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 섹션 2: 오늘의 운세 높이기 */}
        <motion.section {...item(3)}>
          <CloverBoostCard
            baseLeaveRate={onTimeLeaveRate}
            boosted={cloverBoosted}
            onBoostComplete={() => {
              setCloverBoosted(true);
              showToast("🍀 네잎클로버가 가득 채워져 정시퇴근 확률이 올라갔어요!");
            }}
          />
        </motion.section>

        {/* 섹션 3: 오늘의 행운 가이드 */}
        <motion.section
          {...item(4)}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.06] p-5 backdrop-blur-md"
        >
          <p className="mb-3 text-[12px] font-semibold tracking-tight text-white/55">오늘의 행운 가이드</p>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-white/10 p-3.5">
              <p className="text-[11.5px] font-semibold text-white/65">🍀 행운의 업무템</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-amber-100">{fortune.luckyItem}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3.5">
              <p className="text-[11.5px] font-semibold text-white/65">⏰ 업무 골든타임</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-sky-200">{goldenTime}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3.5">
              <p className="text-[11.5px] font-semibold text-white/65">🍽️ 오늘의 행운 점심</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-amber-200">{luckyLunch.menu}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3.5">
              <p className="text-[11.5px] font-semibold text-white/65">☕ 영혼 수혈 음료</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-emerald-200">{luckyDrink}</p>
            </div>
          </div>

          <div className="mt-2.5 space-y-2 rounded-2xl bg-black/20 px-4 py-3 text-[13px]">
            <p className="flex items-start gap-2 leading-snug">
              <span className="shrink-0 font-bold text-pink-200">🤝 찰떡 동료</span>
              <span className="text-white/90">{bestPartner}</span>
            </p>
            <p className="flex items-start gap-2 border-t border-white/10 pt-2 leading-snug">
              <span className="shrink-0 font-bold text-rose-300">🚫 주의할 점</span>
              <span className="text-white/90">{tabooAction}</span>
            </p>
          </div>

          <div className="mt-3 rounded-2xl bg-white/[0.06] px-4 py-3.5">
            <p className="text-[14px] leading-snug text-white/90">💼 {result.teamLine}</p>
            <p className="mt-2 text-[14.5px] font-bold leading-snug text-amber-100">“{fortune.message}”</p>
          </div>
        </motion.section>

        {/* 섹션 4: 동료에게 부적 선물하기 & 공유하기 */}
        <motion.section
          {...item(5)}
          className="rounded-3xl border border-[#e8cf8c]/30 bg-gradient-to-br from-brand/35 to-purple-900/40 p-5 backdrop-blur"
        >
          <p className="text-center text-sm font-bold text-amber-100">
            🎁 팀 동료에게 행운을 나눠보세요!
          </p>
          <p className="mt-1.5 whitespace-nowrap text-center text-[11px] leading-relaxed tracking-tight text-white/75 sm:text-xs">
            정시 칼퇴·승진·성과급 등 8종 부엉이 부적을 골라
            <br />
            동료에게 선물하거나 운세 링크를 공유할 수 있어요
          </p>
          <div className="mt-3.5 grid grid-cols-[1.25fr_1fr] gap-2.5">
            <button
              type="button"
              onClick={() => setGiftOpen(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#f7e5b4]/50 bg-gradient-to-b from-[#f3dc99] to-[#d8b459] px-3.5 text-[13.5px] font-bold text-[#1b0e38] shadow-[0_8px_20px_-4px_rgba(216,180,89,0.35),inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:brightness-105 active:scale-[0.98]"
            >
              <span>동료에게 부적 선물하기</span>
            </button>
            <button
              type="button"
              onClick={copyInviteLink}
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/15 px-3 text-[13px] font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"
            >
              <span>운세 링크 복사</span>
            </button>
          </div>
        </motion.section>

        {/* 섹션 5: 24종 운세 도감 */}
        <motion.section {...item(6)} className="rounded-3xl bg-white/10 p-4">
          <div className="mb-2 text-center">
            <p className="text-sm font-bold text-white/90">
              🦉 오늘의 운세 도감 ({collectedCount}/{total}종 발견)
            </p>
            <p className="mt-0.5 text-[11px] text-white/60">
              총 {total}가지 업무 운세 카드가 숨어 있어요! 다시 뽑기로 모아보세요
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

      {/* 하단 네비게이션 버튼 */}
      <motion.div {...item(7)} className="mt-6 flex flex-col items-center gap-2.5">
        <div className="grid w-full grid-cols-2 gap-2.5">
          <button
            onClick={onRetry}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 text-[14px] font-semibold text-white transition hover:bg-white/15 active:scale-[0.98]"
          >
            <span>카드 다시 뽑기</span>
          </button>
          <button
            onClick={onEditName}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] text-[13.5px] font-medium text-white/80 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            <span>첫 화면으로 (이름 변경)</span>
          </button>
        </div>
        <p className="mt-1 text-center text-xs text-white/50">재미로 보는 운세예요. 오늘도 힘내세요!</p>
      </motion.div>

      {/* 하단 고정 액션 바: 행운 카드 저장 + 내 운세 공유 */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[480px] gap-2.5 bg-gradient-to-t from-night-900 via-night-900/95 to-transparent px-5 pb-5 pt-8">
        <button
          onClick={() => setMyCardOpen(true)}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border border-white/80 bg-white/95 text-[14.5px] font-bold text-night-900 shadow-lg transition hover:bg-white active:scale-[0.98]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 4V15M12 15L8 11M12 15L16 11M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>행운 카드 저장</span>
        </button>
        <button
          onClick={shareResult}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border border-purple-300/35 bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] text-[14.5px] font-bold text-white shadow-[0_8px_20px_-4px_rgba(109,40,217,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:brightness-105 active:scale-[0.98]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7M16 6l-4-4-4 4M12 2v13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>내 운세 공유하기</span>
        </button>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed inset-x-0 bottom-24 z-50 mx-auto w-fit max-w-[90%] rounded-full bg-black/85 px-5 py-3 text-center text-xs font-medium text-white shadow-xl backdrop-blur"
        >
          {toast}
        </div>
      )}

      {/* 내 행운 카드 프리뷰 & 저장 시트 (말풍선 미노출) */}
      {myCardOpen && (
        <MyLuckyCardModal
          name={result.name}
          fortuneId={fortune.id}
          fortuneTitle={fortune.title}
          owlSrc={fortune.characterImage}
          onClose={() => setMyCardOpen(false)}
          onToast={showToast}
        />
      )}

      {/* 동료에게 부엉이 부적 선물하기 시트 */}
      {giftOpen && (
        <TalismanGiftModal
          senderName={result.name}
          senderTeam={result.team}
          onClose={() => setGiftOpen(false)}
          onToast={showToast}
        />
      )}
    </div>
  );
}
