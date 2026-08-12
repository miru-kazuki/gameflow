"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GamePlayerProps {
  buildPath: string;
  title: string;
}

export default function GamePlayer({ buildPath, title }: GamePlayerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const gameUrl = buildPath || "/builds/deck-recycle/latest/index.html";

  return (
    <div className="relative w-full">
      <div
        className={`relative mx-auto overflow-hidden rounded-2xl border border-zinc-700/60 bg-zinc-900 shadow-xl ring-1 ring-white/5 transition-all ${
          fullscreen
            ? "fixed inset-4 z-50 rounded-xl"
            : "aspect-video w-full max-w-[1280px]"
        }`}
      >
        {loading && !error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-900/90 text-white backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="text-sm font-medium text-zinc-300">Loading {title}...</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-zinc-900 text-white p-6 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-500" />
            <h3 className="text-lg font-semibold">Failed to Load Game Build</h3>
            <p className="text-sm text-zinc-400 max-w-md">
              The game build asset at <code className="text-xs bg-zinc-800 p-1 rounded text-zinc-300">{gameUrl}</code> could not be loaded or was not found (404).
            </p>
          </div>
        )}

        <iframe
          src={gameUrl}
          title={title}
          className="block h-full w-full min-h-[320px] border-0 bg-transparent"
          style={{
            transform: fullscreen ? "scale(1.06)" : "scale(1.00)",
            transformOrigin: "center center",
          }}
          allow="autoplay; fullscreen; gamepad"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 z-20 h-8 w-8 opacity-80 hover:opacity-100 bg-zinc-800/80 text-white hover:bg-zinc-700"
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

