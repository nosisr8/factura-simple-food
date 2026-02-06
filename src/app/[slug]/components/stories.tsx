"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useRestaurantStoriesStore } from "@/stores/restaurant-stories";

const DEFAULT_DURATION_MS = 15_000;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function useStoryProgress(args: {
  count: number;
  durationMs: number;
  isOpen: boolean;
  onEnd?: () => void;
}) {
  const { count, durationMs, isOpen, onEnd } = args;
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1

  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const progressRef = useRef(0);
  const indexRef = useRef(0);

  progressRef.current = progress;
  indexRef.current = index;

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
  };

  const tick = (ts: number) => {
    if (!isOpen || pausedRef.current) return;
    if (startRef.current == null) startRef.current = ts - progressRef.current * durationMs;
    const nextProgress = clamp((ts - startRef.current) / durationMs, 0, 1);
    setProgress(nextProgress);
    if (nextProgress >= 1) {
      const currentIndex = indexRef.current;
      const lastIndex = Math.max(0, count - 1);
      if (count > 0 && currentIndex >= lastIndex) {
        stop();
        onEnd?.();
        return;
      }

      setIndex((i) => (count ? i + 1 : 0));
      setProgress(0);
      startRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    stop();

    // Si cambió la cantidad, aseguramos un index válido.
    if (count > 0) setIndex((i) => clamp(i, 0, count - 1));
    if (count === 0) setIndex(0);

    if (!isOpen) {
      // Reset al cerrar.
      setIndex(0);
      setProgress(0);
      return stop;
    }

    // Al abrir, mantenemos el índice actual (permite abrir en una miniatura específica).
    setProgress(0);
    startRef.current = null;
    pausedRef.current = false;
    if (count > 0) rafRef.current = requestAnimationFrame(tick);

    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, count, durationMs]);

  const prev = () => {
    setIndex((i) => (count ? (i - 1 + count) % count : 0));
    setProgress(0);
    startRef.current = null;
  };

  const next = () => {
    const currentIndex = indexRef.current;
    const lastIndex = Math.max(0, count - 1);
    if (count > 0 && currentIndex >= lastIndex) {
      onEnd?.();
      return;
    }

    setIndex((i) => (count ? i + 1 : 0));
    setProgress(0);
    startRef.current = null;
  };

  const pause = () => {
    pausedRef.current = true;
    stop();
  };

  const resume = () => {
    if (!isOpen) return;
    pausedRef.current = false;
    stop();
    rafRef.current = requestAnimationFrame(tick);
  };

  return { index, progress, prev, next, pause, resume, setIndex, setProgress };
}

export function RestaurantStories(props: {
  restaurantId: string;
  restaurantName: string;
  avatarImageUrl: string;
  isActive: boolean;
  imageUrls: string[];
  durationMs?: number;
  className?: string;
}) {
  const durationMs = props.durationMs ?? DEFAULT_DURATION_MS;
  const images = useMemo(() => props.imageUrls.filter(Boolean), [props.imageUrls]);
  const enabled = props.isActive && images.length > 0;

  const [open, setOpen] = useState(false);
  const { index, progress, prev, next, pause, resume, setIndex, setProgress } = useStoryProgress({
    count: images.length,
    durationMs,
    isOpen: open,
    onEnd: () => setOpen(false),
  });

  if (!enabled) return null;

  const currentUrl = images[index] ?? images[0] ?? "";

  const markSeen = useRestaurantStoriesStore((s) => s.markSeen);
  const isSeen = useRestaurantStoriesStore((s) => s.isSeen);
  const hasHydrated = useRestaurantStoriesStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!open) return;
    if (!currentUrl) return;
    markSeen(props.restaurantId, currentUrl);
  }, [open, currentUrl, markSeen, props.restaurantId]);

  return (
    <div className={cn("flex items-center gap-3", props.className)}>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) {
            setIndex(0);
            setProgress(0);
          }
        }}
      >
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 text-white">
              <p className="text-sm font-medium leading-tight">Estados</p>
            </div>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((url, i) => {
              const seen = hasHydrated ? isSeen(props.restaurantId, url) : false;
              return (
                <button
                  key={`${url}-${i}`}
                  type="button"
                  className="group shrink-0"
                  aria-label={`Ver estado ${i + 1}`}
                  onClick={() => {
                    setIndex(i);
                    setProgress(0);
                    setOpen(true);
                  }}
                >
                  <span
                    className={cn(
                      "relative block h-16 w-16 rounded-full p-[2px]",
                      seen
                        ? "bg-white/25"
                        : "bg-gradient-to-tr from-fuchsia-500 via-red-500 to-yellow-400",
                    )}
                  >
                    {!seen ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/70 motion-safe:animate-pulse"
                      />
                    ) : null}
                    <span className="relative block h-full w-full overflow-hidden rounded-full bg-black/20">
                      <Image
                        src={url}
                        alt={`${props.restaurantName} - estado ${i + 1}`}
                        fill
                        className="object-cover transition group-hover:scale-[1.02]"
                        sizes="64px"
                      />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <DialogContent className="w-[calc(100vw-2rem)] max-w-md overflow-hidden border-none bg-black p-0">
          <DialogTitle className="sr-only">{`Estados de ${props.restaurantName}`}</DialogTitle>
          <div className="relative aspect-[9/16] w-full">
            <Image
              src={currentUrl}
              alt={`${props.restaurantName} - estado ${index + 1}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />

            <div className="absolute inset-x-0 top-0 p-3">
              <div className="flex gap-1">
                {images.map((_, i) => {
                  const w =
                    i < index ? 100 : i > index ? 0 : Math.round(clamp(progress, 0, 1) * 100);
                  return (
                    <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                      <div className="h-full rounded-full bg-white" style={{ width: `${w}%` }} />
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20">
                  <Image src={props.avatarImageUrl} alt={props.restaurantName} fill className="object-cover" sizes="32px" />
                </div>
                <p className="text-sm font-medium text-white">{props.restaurantName}</p>
              </div>
            </div>

            {/* Controles tipo IG: tap izquierda/derecha */}
            <button
              type="button"
              className="absolute inset-y-0 left-0 w-1/2"
              aria-label="Anterior"
              onClick={prev}
              onPointerDown={pause}
              onPointerUp={resume}
              onPointerCancel={resume}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 w-1/2"
              aria-label="Siguiente"
              onClick={next}
              onPointerDown={pause}
              onPointerUp={resume}
              onPointerCancel={resume}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

