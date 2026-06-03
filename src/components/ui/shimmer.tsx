'use client';

import { cn } from '@/lib/utils';

export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted/50',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className
      )}
    />
  );
}

export function ShimmerCard() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <Shimmer className="h-4 w-1/3" />
      <Shimmer className="h-8 w-1/2" />
      <Shimmer className="h-3 w-2/3" />
      <div className="pt-2 space-y-2">
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function ShimmerChart() {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <Shimmer className="h-4 w-1/4" />
      <Shimmer className="h-3 w-1/3" />
      <Shimmer className="h-64 w-full" />
    </div>
  );
}

export function ShimmerTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <div className="flex gap-4 pb-4 border-b border-border">
        <Shimmer className="h-4 flex-1" />
        <Shimmer className="h-4 flex-1" />
        <Shimmer className="h-4 flex-1" />
        <Shimmer className="h-4 w-24" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Shimmer className="h-4 flex-1" />
          <Shimmer className="h-4 flex-1" />
          <Shimmer className="h-4 flex-1" />
          <Shimmer className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
