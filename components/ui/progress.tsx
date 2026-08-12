"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number; // 0 to 100
  showValue?: boolean;
  statusText?: string;
  size?: "sm" | "md" | "lg";
  onCancel?: () => void;
  cancelLabel?: string;
}

export function Progress({
  value = 0,
  showValue = true,
  statusText,
  size = "md",
  onCancel,
  cancelLabel = "Batal",
  className,
  ...props
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)} {...props}>
      <div className="flex items-center justify-between text-xs font-medium gap-2">
        {statusText && (
          <span className="text-muted-foreground truncate max-w-[180px] sm:max-w-[260px]" title={statusText}>
            {statusText}
          </span>
        )}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {showValue && (
            <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
              {Math.round(clampedValue)}%
            </span>
          )}
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-6 px-1.5 text-[11px] text-red-500 hover:text-red-700 hover:bg-red-100/60 dark:hover:bg-red-950/50 rounded transition-colors"
              title="Batalkan proses sync"
            >
              <X className="h-3 w-3 mr-1" />
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60",
          heightClasses[size]
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-300 ease-out rounded-full shadow-sm"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
