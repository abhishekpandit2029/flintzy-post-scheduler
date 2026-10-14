import type { Platform, PostStatus } from "@/types/post";

export const PLATFORMS: Platform[] = ["Instagram", "TikTok", "Facebook", "X"];

export const POST_STATUSES: PostStatus[] = ["scheduled", "published", "failed"];

export const CHARACTER_LIMITS: Record<Platform, number> = {
  X: 280,
  Instagram: 2200,
  TikTok: 2200,
  Facebook: 5000,
};

export const POST_STORAGE_KEY = "flintzy-post-scheduler-posts";

export const PLATFORM_COLORS: Record<Platform, string> = {
  Instagram: "bg-pink-50 text-pink-600",
  TikTok: "bg-slate-100 text-slate-800",
  Facebook: "bg-blue-50 text-blue-600",
  X: "bg-slate-100 text-slate-900",
};

export const STATUS_COLORS: Record<PostStatus, string> = {
  scheduled: "bg-violet-50 text-violet-700",
  published: "bg-emerald-50 text-emerald-700",
  failed: "bg-red-50 text-red-700",
};

export const POST_STAT_CARDS: {
  status: PostStatus;
  label: string;
  note: string;
  icon: string;
  color: string;
}[] = [
  {
    status: "scheduled",
    label: "Upcoming posts",
    note: "in your queue",
    icon: "◷",
    color: "bg-violet-50 text-violet-700",
  },
  {
    status: "published",
    label: "Published",
    note: "all time",
    icon: "✓",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    status: "failed",
    label: "Needs attention",
    note: "failed posts",
    icon: "!",
    color: "bg-orange-50 text-orange-700",
  },
];
