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

const OWL_REACTIONS = [
  "부엉! 오늘 하시는 일마다 술술 풀릴 거예요",
  "부엉부엉! 오후에도 좋은 소식이 찾아올 거예요",
  "행운 기운 100% 전달 완료! 오늘도 응원해요",
  "오늘 퇴근길 발걸음은 유독 가벼울 거예요",
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
  const [toast, setToast] = useState<string | null>(null);
  const [petIdx, setPetIdx] = useState<number | null>(null);
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
    const title = "오늘의 업무 운세";
    const text = `${result.team} ${result.name}님의 오늘의 업무 운세는 「${fortune.title}」!\n(${cardMeta.line1} ${cardMeta.line2})\n\n당신의 오늘 업무 운세도 뽑아보세요`;

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
      showToast("내 운세 결과와 링크가 복사되었어요");
    } catch {
      showToast("공유 링크 복사에 실패했어요");
    }
  };

  const copyInviteLink = async () => {
    track("share_click", { fortune: fortune.id, type: "invite_link" });
    const url = getShareUrl();
    const inviteText = `[오늘의 업무 운세]\n카드 한 장을 뽑으면 부엉이가 오늘의 업무 운세와 행운 점심 메뉴를 알려줘요.\n\n지금 바로 뽑아보기\n${url}`;
    try {
      await navigator.clipboard.writeText(inviteText);
      showToast("공유 링크가 복사되었어요. 메신저에 붙여넣어 보세요");
    } catch {
      showToast("링크 복사에 실패했어요");
    }
  };

  const handlePetOwl = () => {
    setPetIdx((prev) => (prev === null ? 0 : (prev + 1) % OWL_REACTIONS.length));
  };

  const metricRows: { label: string; score: number; pct: number }[] = [
    { label: "집중력", score: scores.focus, pct: scores.focus * 20 },
    { label: "협업운", score: scores.teamwork, pct: scores.teamwork * 20 },
    { label: "소통운", score: scores.communication, pct: scores.communication * 20 },
  ];

  return (
    <div className="relative min-h-[100dvh] px-5 pb-40 pt-7">
      {/* 상단 네비게이션 바 */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 text-xs font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>다시 뽑기</span>
        </button>
        <button
          type="button"
          onClick={onEditName}
          className="inline-flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3.5 text-xs font-medium text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <span>이름 변경</span>
        </button>
      </div>

      {/* 상단 타이틀 헤더 (토스 레퍼런스 감성의 정돈된 타이포그래피) */}
      <motion.div {...item(0)} className="mb-5 flex flex-col items-center text-center">
        <p className="text-[14px] font-semibold text-white/65">
          {month}월 {day}일 {result.team} {result.name}님의 운세
        </p>
        <h1 className="mt-1.5 text-[24px] font-extrabold leading-snug tracking-tight text-white">
          {fortune.title}
        </h1>
      </motion.div>

      {/* 히어로: 레퍼런스 형식의 행운 카드 */}
      <motion.div {...item(1)} className="mb-6 flex flex-col items-center">
        <LuckyTalismanCard
          badgeText="오늘의 행운 카드"
          owlSrc={fortune.characterImage}
          line1={cardMeta.line1}
          line2={cardMeta.line2}
          subText={`정시퇴근 확률 ${effectiveLeaveRate}% · ${result.talismanTitle}`}
          themeKey={cardMeta.themeKey}
          emblemType={cardMeta.emblemType}
          onClickOwl={handlePetOwl}
        />
        <p className="mt-2.5 text-xs font-medium text-white/50">
          {petIdx !== null ? OWL_REACTIONS[petIdx] : "카드 속 부엉이를 가볍게 터치해 보세요"}
        </p>
      </motion.div>

      <div className="space-y-3.5">
        {/* 섹션 1: 오늘의 업무 리포트 (불필요한 이모지 없이 깔끔한 넘버링 + 프로그레스 바) */}
        <motion.section
          {...item(2)}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-md"
        >
          <p className="text-[12px] font-semibold tracking-tight text-white/50">오늘의 업무 흐름</p>
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

        {/* 섹션 2: 오늘의 운세 높이기 (네잎클로버 투명 모형 -> 색상 채우기 인터랙션) */}
        <motion.section {...item(3)}>
          <CloverBoostCard
            baseLeaveRate={onTimeLeaveRate}
            boosted={cloverBoosted}
            onBoostComplete={() => {
              setCloverBoosted(true);
              showToast("네잎클로버가 가득 채워져 정시퇴근 확률이 올라갔어요!");
            }}
          />
        </motion.section>

        {/* 섹션 3: 오늘의 행운 처방전 (깔끔한 2x2 벤토 그리드 + 동료/주의 포인트) */}
        <motion.section
          {...item(4)}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-md"
        >
          <p className="text-[12px] font-semibold tracking-tight text-white/50">오늘의 행운 가이드</p>

          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3.5">
              <p className="text-[11.5px] font-medium text-white/50">행운의 업무템</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-white">{fortune.luckyItem}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3.5">
              <p className="text-[11.5px] font-medium text-white/50">업무 골든타임</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-white">{goldenTime}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3.5">
              <p className="text-[11.5px] font-medium text-white/50">추천 점심 메뉴</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-white">{luckyLunch.menu}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-3.5">
              <p className="text-[11.5px] font-medium text-white/50">충전 음료</p>
              <p className="mt-1 text-[14px] font-bold leading-snug text-white">{luckyDrink}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2 rounded-2xl border border-white/[0.06] bg-black/20 p-4 text-[13.5px]">
            <div className="flex items-start justify-between gap-4">
              <span className="shrink-0 font-medium text-white/50">찰떡 동료</span>
              <span className="text-right font-semibold text-white/90">{bestPartner}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-t border-white/[0.06] pt-2">
              <span className="shrink-0 font-medium text-white/50">주의할 점</span>
              <span className="text-right font-semibold text-white/90">{tabooAction}</span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/[0.04] px-4 py-3.5">
            <p className="text-[13.5px] leading-relaxed text-white/80">{result.teamLine}</p>
            <p className="mt-1.5 text-[14px] font-bold text-[#f3dc99]">“{fortune.message}”</p>
          </div>
        </motion.section>

        {/* 섹션 4: 동료에게 행운 카드 선물하기 */}
        <motion.section
          {...item(5)}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-md"
        >
          <p className="text-[12px] font-semibold tracking-tight text-white/50">행운 나누기</p>
          <h3 className="mt-0.5 text-[16px] font-bold text-white">
            동료에게도 오늘의 행운 카드를 보내보세요
          </h3>
          <p className="mt-1 text-[12.5px] text-white/60">
            동료 이름을 담아 행운 카드를 이미지로 저장하거나 선물 링크를 전달할 수 있어요
          </p>
          <div className="mt-4 grid grid-cols-[1.25fr_1fr] gap-2.5">
            <button
              type="button"
              onClick={() => setGiftOpen(true)}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-[13.5px] font-bold text-night-900 shadow-sm transition hover:bg-white/90 active:scale-[0.98]"
            >
              <span>행운 카드 선물하기</span>
            </button>
            <button
              type="button"
              onClick={copyInviteLink}
              className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.06] px-3 text-[13.5px] font-semibold text-white/90 transition hover:bg-white/[0.12] active:scale-[0.98]"
            >
              <span>운세 링크 복사</span>
            </button>
          </div>
        </motion.section>

        {/* 섹션 5: 12종 부엉이 도감 (절제된 미니멀 리스트) */}
        <motion.section
          {...item(6)}
          className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-bold text-white/85">발견한 부엉이 도감</span>
            <span className="text-[12px] font-semibold text-white/55">
              {collectedCount} / {total}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FORTUNES.map((f) => {
              const got = collectedIds.includes(f.id);
              return (
                <span
                  key={f.id}
                  className={`rounded-full px-3 py-1 text-[11.5px] ${
                    got
                      ? "bg-white/90 font-semibold text-night-900"
                      : "border border-white/[0.06] bg-white/[0.03] text-white/35"
                  }`}
                >
                  {got ? f.title : "미발견"}
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
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] text-[13.5px] font-semibold text-white/90 transition hover:bg-white/10 active:scale-[0.98]"
          >
            <span>카드 다시 뽑기</span>
          </button>
          <button
            onClick={onEditName}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] text-[13.5px] font-medium text-white/70 transition hover:bg-white/10 hover:text-white active:scale-[0.98]"
          >
            <span>첫 화면으로 돌아가기</span>
          </button>
        </div>
      </motion.div>

      {/* 하단 고정 액션 바: 행운 카드 이미지 저장(레퍼런스 모달 오픈) + 공유하기 */}
      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[480px] gap-2.5 bg-gradient-to-t from-night-900 via-night-900/95 to-transparent px-5 pb-5 pt-8">
        <button
          onClick={() => setMyCardOpen(true)}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-white text-[14.5px] font-bold text-night-900 shadow-lg transition hover:bg-white/95 active:scale-[0.98]"
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
          <span>행운 카드 저장</span>
        </button>
        <button
          onClick={shareResult}
          className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#6d47d9] text-[14.5px] font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.98]"
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
          <span>내 운세 공유</span>
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

      {/* 내 행운 카드 프리뷰 & 저장 시트 (첨부 레퍼런스와 동일한 구성) */}
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

      {/* 동료에게 행운 카드 선물하기 시트 */}
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
