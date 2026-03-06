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
    <div className="h-screen w-screen overflow-hidden">
      <main className="relative h-full w-full">
        <Image
          src="/top-banner.png"
          alt="トップバナー"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-x-0 bottom-[10%] z-20 flex justify-center">
          <div className="rounded-xl bg-black/25 p-1.5 backdrop-blur-sm">
            <Button
              size="lg"
              className="border-0 text-xl px-8 py-6 bg-white text-gray-900 shadow-lg hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={handleStartClick}
              disabled={isNavigating}
            >
              スタート
            </Button>
          </div>
        </div>
      </main>
      <LoadingOverlay active={isNavigating} text="クイズへ移動中..." />
    </div>
  );
}
