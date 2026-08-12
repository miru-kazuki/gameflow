"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GamePlayerProps {
  buildPath: string;
  title: string;
}

export default function GamePlayer({ buildPath, title }: GamePlayerProps) {
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const gameUrl = "/builds/deck-recycle/latest/index.html";

  return (
    <div className="relative">
      <div
        className={`relative mx-auto overflow-hidden rounded-2xl border border-zinc-700/60 bg-transparent shadow-xl ring-1 ring-white/5 ${
          fullscreen
            ? "fixed inset-4 z-50 rounded-xl"
            : "aspect-video w-full max-w-[1280px]"
        }`}
      >
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-900/90 text-white backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm text-zinc-300">Loading {title}...</p>
          </div>
        )}

        <iframe
          src={gameUrl}
          title={title}
          className="block h-full w-full border-0 bg-transparent"
          style={{
            transform: fullscreen ? "scale(1.06)" : "scale(1.08)",
            transformOrigin: "center center",
          }}
          allow="autoplay; fullscreen; gamepad"
          onLoad={() => setLoading(false)}
        />

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 z-20 h-8 w-8 opacity-80 hover:opacity-100"
          onClick={() => setFullscreen(!fullscreen)}
        >
          {fullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
