"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchQuestion, type QuestionItem } from "@/src/lib/api/fetchQuestion";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";
import { HandDisplay } from "@/components/HandDisplay";
import { AnswerPicker } from "@/components/AnswerPicker";
import { ResultModal } from "@/components/ResultModal";
import { Button } from "@/components/ui/button";

type QuizState = "loading" | "error" | "ready";

function isCorrectAnswer(selected: TileCode[], winning: TileCode[]): boolean {
  const a = new Set(selected);
  const b = new Set(winning);
  if (a.size !== b.size) return false;
  for (const t of Array.from(a)) if (!b.has(t)) return false;
  return true;
}

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("loading");
  const [question, setQuestion] = useState<QuestionItem | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<TileCode[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCorrect, setModalCorrect] = useState(false);

  const load = async () => {
    setState("loading");
    setErrorMessage("");
    try {
      const q = await fetchQuestion();
      setQuestion(q);
      setSelectedTiles([]);
      setState("ready");
    } catch (e) {
      setState("error");
      setErrorMessage(e instanceof Error ? e.message : "出題の取得に失敗しました");
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
          <Button onClick={load}>リトライ</Button>
          <Button variant="outline" asChild>
            <Link href="/">トップへ戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (state === "ready" && question) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">戻る</Link>
          </Button>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">手牌</h2>
          <HandDisplay tiles={question.tiles} />
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">待ち牌を選んでください（複数選択可）</h2>
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
              const correct = isCorrectAnswer(selectedTiles, question.winningTiles);
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
