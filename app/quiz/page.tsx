"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchQuestions, type QuestionItem } from "@/src/lib/api/fetchQuestions";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";
import { HandDisplay } from "@/components/HandDisplay";
import { AnswerPicker } from "@/components/AnswerPicker";
import { ResultModal } from "@/components/ResultModal";
import { Button } from "@/components/ui/button";

type QuizState = "loading" | "error" | "ready";
type AnswerState = "correct" | "incorrect";

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
      setState("ready");
    } catch (e) {
      setState("error");
      setErrorMessage(
        e instanceof Error ? e.message : "出題の取得に失敗しました"
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <p className="text-lg">読み込み中...</p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-center">{errorMessage}</p>
        <div className="flex gap-2">
          <Button onClick={load}>もう一度試す</Button>
          <Button variant="outline" asChild>
            <Link href="/">トップへ戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (state === "ready" && view === "result") {
    // FR-008: 各問は最大1回。初回正解=正解、それ以外=不正解。未回答(null)=不正解としてカウント
    const correctCount = answers.filter((a) => a === "correct").length;
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col items-center justify-center gap-6">
        <h2 className="text-2xl font-bold">結果</h2>
        <p className="text-4xl font-semibold text-green-600">
          {correctCount} / 10
        </p>
        <Button asChild>
          <Link href="/">トップへ戻る</Link>
        </Button>
      </div>
    );
  }

  const question = questions[currentIndex];
  if (state === "ready" && question) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">戻る</Link>
          </Button>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">手牌</h2>
          <HandDisplay tiles={question.tiles} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">
            待ち牌を選んでください（複数選択可）
          </h2>
          <AnswerPicker
            selectedTiles={selectedTiles}
            onChange={setSelectedTiles}
          />
        </section>

        <div className="mt-4">
          <Button
            size="lg"
            disabled={selectedTiles.length < 1}
            className="w-full"
            onClick={() => {
              if (!question) return;
              const correct = isCorrectAnswer(
                selectedTiles,
                question.winningTiles
              );
              setAnswers((prev) => {
                const next = [...prev];
                if (next[currentIndex] === null) {
                  next[currentIndex] = correct ? "correct" : "incorrect";
                }
                return next;
              });
              setModalCorrect(correct);
              setModalOpen(true);
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
          }}
        />
      </div>
    );
  }

  return null;
}
