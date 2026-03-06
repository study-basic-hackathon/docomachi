"use client";

interface LoadingOverlayProps {
  active: boolean;
  text?: string;
}

export function LoadingOverlay({ active, text = "読み込み中..." }: LoadingOverlayProps) {
  if (!active) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white/95 px-6 py-8 shadow-lg">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"
          role="status"
          aria-label="読み込み中"
        />
        {text && <p className="text-sm font-medium text-gray-700">{text}</p>}
      </div>
    </div>
  );
}
