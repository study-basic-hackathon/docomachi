"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HandDisplay } from "@/components/HandDisplay";
import type { TileCode } from "@/src/lib/mahjong/mahjongHand";

interface ResultModalProps {
  open: boolean;
  isCorrect: boolean;
  /** 0–9: 現在の問題番号（9 = 10問目） */
  currentIndex: number;
  /** 不正解時に「解答を見る」で表示する正解の待ち牌 */
  winningTiles?: TileCode[];
  onNextQuestion: () => void;
  onSeeResults: () => void;
  onClose: () => void;
}

export function ResultModal({
  open,
  isCorrect,
  currentIndex,
  winningTiles = [],
  onNextQuestion,
  onSeeResults,
  onClose,
}: ResultModalProps) {
  const [showAnswerView, setShowAnswerView] = useState(false);

  useEffect(() => {
    if (open) setShowAnswerView(false);
  }, [open]);

  if (!open) return null;

  const isLastQuestion = currentIndex === 9;

  const handleClose = () => {
    setShowAnswerView(false);
    onClose();
  };

  if (showAnswerView) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="answer-title"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <h2 id="answer-title" className="text-lg font-bold mb-2 text-center">
            正解の待ち牌
          </h2>
          <div className="flex justify-center my-4">
            <HandDisplay tiles={winningTiles} />
          </div>
          <Button onClick={() => setShowAnswerView(false)} className="w-full">
            戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 text-center">
        <h2 id="result-title" className="text-xl font-bold mb-2">
          {isCorrect ? "正解" : "不正解"}
        </h2>
        <p className="text-gray-600 mb-4">
          {isCorrect ? "正解です！" : "残念、不正解です。"}
        </p>
        {isCorrect ? (
          isLastQuestion ? (
            <Button onClick={onSeeResults} className="w-full">
              結果を見る
            </Button>
          ) : (
            <Button onClick={onNextQuestion} className="w-full">
              次の問題へ
            </Button>
          )
        ) : (
          <div className="flex flex-col gap-2">
            {!isLastQuestion ? (
              <Button onClick={onNextQuestion} className="w-full" variant="default">
                次の問題へ
              </Button>
            ) : (
              <Button onClick={onSeeResults} className="w-full" variant="default">
                結果を見る
              </Button>
            )}
            <Button
              onClick={() => setShowAnswerView(true)}
              className="w-full"
              variant="outline"
            >
              解答を見る
            </Button>
            <Button onClick={handleClose} className="w-full" variant="ghost">
              閉じる（やり直す）
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
