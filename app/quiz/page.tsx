"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { fetchQuestions, type QuestionItem } from "@/src/lib/api/fetchQuestions";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";
import { HandDisplay } from "@/components/HandDisplay";
import { AnswerPicker } from "@/components/AnswerPicker";
import { ResultModal } from "@/components/ResultModal";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

type QuizState = "loading" | "error" | "ready";
type AnswerState = "correct" | "incorrect";
type ResolutionReason = "manual" | "timeout";

const QUIZ_TIME_LIMIT_SECONDS = 15;

function calcRemainingSeconds(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

function isCorrectAnswer(selected: TileCode[], winning: TileCode[]): boolean {
  const a = new Set(selected);
  const b = new Set(winning);
  if (a.size !== b.size) return false;
  for (const t of Array.from(a)) if (!b.has(t)) return false;
  return true;
}

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("loading");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(AnswerState | null)[]>(
    () => Array(10).fill(null) as (AnswerState | null)[]
  );
  const [selectedTiles, setSelectedTiles] = useState<TileCode[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCorrect, setModalCorrect] = useState(false);
  const [view, setView] = useState<"quiz" | "result">("quiz");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [deadlineAt, setDeadlineAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(QUIZ_TIME_LIMIT_SECONDS);
  const [resolved, setResolved] = useState(false);
  const [running, setRunning] = useState(true);
  const resolvedRef = useRef(false);
  const runningRef = useRef(true);
  const deadlineAtRef = useRef<number | null>(null);

  const syncResolutionState = (next: boolean) => {
    resolvedRef.current = next;
    setResolved(next);
  };

  const syncRunningState = (next: boolean) => {
    runningRef.current = next;
    setRunning(next);
  };

  const initQuestionTimer = () => {
    const now = Date.now();
    const deadline = now + QUIZ_TIME_LIMIT_SECONDS * 1000;
    setStartedAt(now);
    setDeadlineAt(deadline);
    deadlineAtRef.current = deadline;
    setRemainingSeconds(QUIZ_TIME_LIMIT_SECONDS);
    syncRunningState(true);
    syncResolutionState(false);
  };

  const resolveCurrentQuestion = (
    currentQuestionIndex: number,
    answerState: AnswerState,
    _reason: ResolutionReason
  ) => {
    if (resolvedRef.current) return;
    syncRunningState(false);
    syncResolutionState(true);
    setAnswers((prev) => {
      const next = [...prev];
      if (next[currentQuestionIndex] === null) {
        next[currentQuestionIndex] = answerState;
      }
      return next;
    });
    setModalCorrect(answerState === "correct");
    setModalOpen(true);
  };

  const load = async () => {
    setState("loading");
    setErrorMessage("");
    try {
      const qs = await fetchQuestions();
      setQuestions(qs);
      setCurrentIndex(0);
      setAnswers(Array(10).fill(null) as (AnswerState | null)[]);
      setSelectedTiles([]);
      setView("quiz");
      initQuestionTimer();
      setState("ready");
    } catch (e) {
      setState("error");
      const msg = e instanceof Error ? e.message : "出題の取得に失敗しました";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (state !== "ready" || view !== "quiz" || !questions[currentIndex]) return;
    initQuestionTimer();
    const timerId = window.setInterval(() => {
      if (!runningRef.current) return;
      const currentDeadline = deadlineAtRef.current;
      if (!currentDeadline) return;
      const nextRemaining = calcRemainingSeconds(currentDeadline, Date.now());
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0 && !resolvedRef.current) {
        resolveCurrentQuestion(currentIndex, "incorrect", "timeout");
      }
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [state, view, currentIndex, questions]);

  if (state === "loading") {
    return (
      <div className="relative mx-auto min-h-screen w-full max-w-5xl p-4">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-white/90">読み込み中...</p>
        </div>
        <LoadingOverlay active text="問題を読み込み中..." />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-4 p-4">
        <p className="text-center text-red-100">{errorMessage}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={load} className="bg-white text-[#0f4f2f] hover:bg-gray-100">
            もう一度試す
          </Button>
          <Button variant="outline" asChild className="border-white text-white hover:bg-white/10">
            <Link href="/">トップへ戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (state === "ready" && view === "result") {
    const correctCount = answers.filter((a) => a === "correct").length;
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-6 p-4">
        <h2 className="text-2xl font-bold text-white">結果</h2>
        <p className="text-4xl font-semibold text-green-200">
          {correctCount} / 10
        </p>
        <Button asChild className="bg-white text-[#0f4f2f] hover:bg-gray-100">
          <Link href="/">トップへ戻る</Link>
        </Button>
      </div>
    );
  }

  const question = questions[currentIndex];
  if (state === "ready" && question) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" asChild className="border-white text-white hover:bg-white/10">
            <Link href="/">戻る</Link>
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/80">
              {currentIndex + 1} / {questions.length}
            </span>
            <span
              data-testid="countdown-timer"
              className={`text-sm font-semibold ${
                remainingSeconds <= 3 ? "text-red-300" : "text-emerald-100"
              }`}
            >
              残り時間: {remainingSeconds}秒
            </span>
          </div>
        </div>

        <section className="rounded-lg border border-[#0f4f2f] bg-[#2f7d4b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <h2 className="mb-2 text-lg font-semibold text-emerald-50">手牌</h2>
          <HandDisplay tiles={question.tiles} />
        </section>

        <section className="rounded-lg border border-[#0f4f2f] bg-[#2f7d4b] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          <h2 className="mb-2 text-lg font-semibold text-emerald-50">
            待ち牌を選んでください（複数選択可）
          </h2>
          <AnswerPicker
            selectedTiles={selectedTiles}
            onChange={setSelectedTiles}
          />
        </section>

        <div className="mt-2">
          <Button
            size="lg"
            disabled={selectedTiles.length < 1}
            className="w-full bg-white text-[#0f4f2f] hover:bg-gray-100"
            onClick={() => {
              if (!question) return;
              if (resolvedRef.current) return;
              syncRunningState(false);
              const currentDeadline = deadlineAtRef.current ?? deadlineAt;
              if (currentDeadline && Date.now() >= currentDeadline) {
                resolveCurrentQuestion(currentIndex, "incorrect", "timeout");
                return;
              }
              const correct = isCorrectAnswer(selectedTiles, question.winningTiles);
              resolveCurrentQuestion(currentIndex, correct ? "correct" : "incorrect", "manual");
            }}
          >
            解答する
          </Button>
        </div>

        <ResultModal
          open={modalOpen}
          isCorrect={modalCorrect}
          currentIndex={currentIndex}
          winningTiles={question.winningTiles}
          onNextQuestion={() => {
            setModalOpen(false);
            setSelectedTiles([]);
            setCurrentIndex((i) => i + 1);
          }}
          onSeeResults={() => {
            setModalOpen(false);
            setView("result");
          }}
          onClose={() => {
            setModalOpen(false);
            setSelectedTiles([]);
            if (startedAt) {
              initQuestionTimer();
            }
          }}
        />
      </div>
    );
  }

  return null;
}
