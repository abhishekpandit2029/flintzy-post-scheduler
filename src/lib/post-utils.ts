import { PLATFORMS, POST_STATUSES } from "@/constants/post-scheduler";
import type { Post } from "@/types/post";

export function isPost(value: unknown): value is Post {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<Post>;
  return (
    typeof post.id === "string" &&
    typeof post.content === "string" &&
    Array.isArray(post.platforms) &&
    post.platforms.every((platform) => PLATFORMS.includes(platform)) &&
    typeof post.scheduledAt === "string" &&
    Number.isFinite(Date.parse(post.scheduledAt)) &&
    POST_STATUSES.includes(post.status as Post["status"])
  );
}

export function getDayTitle(date: Date) {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function toLocalDateTimeInput(date: Date) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 16);
}

export function formatPostTime(iso: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatTimezone(iso: string) {
  return new Intl.DateTimeFormat("en", { timeZoneName: "short" })
    .formatToParts(new Date(iso))
    .find((part) => part.type === "timeZoneName")?.value;
}
