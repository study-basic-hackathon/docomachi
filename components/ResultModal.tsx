"use client";

import { Button } from "@/components/ui/button";

interface ResultModalProps {
  open: boolean;
  isCorrect: boolean;
  onClose: () => void;
}

export function ResultModal({ open, isCorrect, onClose }: ResultModalProps) {
  if (!open) return null;

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
        <Button onClick={onClose} className="w-full">
          閉じる
        </Button>
      </div>
    </div>
  );
}
