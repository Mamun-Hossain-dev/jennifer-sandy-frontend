"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DashboardErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function DashboardErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="rounded-[28px] border border-rose-200/80 bg-rose-50/70 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface DashboardEmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
  imageSrc?: string;
}

export function DashboardEmptyState({
  title,
  message,
  action,
  imageSrc = "/images/connect-2.jpg",
}: DashboardEmptyStateProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
            No data
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            {message}
          </p>
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
        <div className="relative min-h-[220px] lg:min-h-full">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/60 via-slate-900/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-10 w-20" />
            <Skeleton className="mt-3 h-3 w-48" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-2 h-4 w-56" />
            </div>
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-6 h-[280px] w-full rounded-[24px]" />
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-44" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSidebarSkeleton() {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm">
      <Skeleton className="h-32 w-full rounded-[24px]" />
      <div className="-mt-10 flex justify-center">
        <Skeleton className="h-20 w-20 rounded-full ring-4 ring-white" />
      </div>
      <div className="mt-5 space-y-3 text-center">
        <Skeleton className="mx-auto h-5 w-40" />
        <Skeleton className="mx-auto h-4 w-24" />
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

interface DashboardTableSkeletonProps {
  rows?: number;
}

export function DashboardTableSkeleton({ rows = 5 }: DashboardTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="divide-y divide-slate-200">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-8 w-24 rounded-full justify-self-start sm:justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}
