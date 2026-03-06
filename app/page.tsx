"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TopPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleStartClick = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push("/quiz");
  };

  return (
    <div className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4">
      <header className="mb-6 w-full flex-shrink-0">
        <Image
          src="/top-banner.png"
          alt="トップバナー"
          width={800}
          height={200}
          className="w-full rounded-lg object-contain"
          priority
        />
      </header>
      <div className="flex flex-col items-center gap-4">
        <Button
          size="lg"
          className="text-xl px-8 py-6 bg-white text-green-700 hover:bg-gray-100"
          onClick={handleStartClick}
          disabled={isNavigating}
        >
          スタート
        </Button>
      </div>
      <LoadingOverlay active={isNavigating} text="クイズへ移動中..." />
    </div>
  );
}
