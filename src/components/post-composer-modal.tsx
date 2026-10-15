"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  CHARACTER_LIMITS,
  PLATFORM_COLORS,
  PLATFORMS,
} from "@/constants/post-scheduler";
import { toLocalDateTimeInput } from "@/lib/post-utils";
import type { Platform, Post } from "@/types/post";
import { PlatformIcon } from "@/components/platform-icon";
import { MediaImage } from "@/components/media-image";

export function PostComposerModal({
  open,
  onClose,
  onCreated,
  postToEdit,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (post: Post) => void;
  postToEdit?: Post | null;
  onUpdated?: (post: Post) => void;
}) {
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<Platform[]>(["Instagram"]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageStatus, setImageStatus] = useState<
    "loading" | "loaded" | "broken"
  >("loading");

  useEffect(() => {
    if (!open) return;
    setContent(postToEdit?.content ?? "");
    setSelected(postToEdit?.platforms ?? ["Instagram"]);
    setMediaUrl(postToEdit?.mediaUrl ?? "");
    setScheduledAt(
      postToEdit ? toLocalDateTimeInput(new Date(postToEdit.scheduledAt)) : "",
    );
    setError("");
  }, [open, postToEdit]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose, saving]);

  if (!open) return null;

  const overLimit = selected.filter(
    (platform) => content.length > CHARACTER_LIMITS[platform],
  );
  const labelClass = "mb-2 block text-xs font-semibold text-slate-700";
  const inputClass =
    "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!content.trim()) return setError("Write something before scheduling.");
    if (!selected.length) return setError("Choose at least one platform.");
    if (!scheduledAt || new Date(scheduledAt).getTime() <= Date.now()) {
      return setError("Choose a date and time in the future.");
    }
    if (mediaUrl.trim() && !/^https?:\/\//i.test(mediaUrl.trim())) {
      return setError("Image URL must start with http:// or https://.");
    }
    if (overLimit.length) {
      return setError(
        `Your post is over the ${overLimit.map((platform) => `${platform} (${CHARACTER_LIMITS[platform]})`).join(", ")} character limit.`,
      );
    }

    setSaving(true);
    try {
      if (postToEdit) {
        onUpdated?.({
          ...postToEdit,
          content: content.trim(),
          platforms: selected,
          mediaUrl: mediaUrl.trim() || undefined,
          scheduledAt: new Date(scheduledAt).toISOString(),
          status: "scheduled",
          errorMessage: undefined,
        });
        onClose();
        return;
      }
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          platforms: selected,
          mediaUrl,
          scheduledAt: new Date(scheduledAt).toISOString(),
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Could not schedule post.");
      onCreated(result.post as Post);
      setContent("");
      setSelected(["Instagram"]);
      setMediaUrl("");
      setScheduledAt("");
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-2 backdrop-blur-[2px] sm:p-5"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        className="relative max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:max-h-[calc(100dvh-2.5rem)] sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2
              id="composer-title"
              className="font-heading text-base font-bold"
            >
              {postToEdit ? "Edit post" : "Create a post"}
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Make something worth sharing.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close composer"
            disabled={saving}
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit}>
          <label className={labelClass} htmlFor="post-content">
            Post content
          </label>
          <div className="overflow-hidden rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
            <textarea
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="What's on your mind? Write something your audience will love..."
              rows={5}
              className="block min-h-32 w-full resize-y p-3 text-xs leading-relaxed text-slate-700 outline-none placeholder:text-slate-400"
            />
            <div className="flex h-9 items-center border-t border-slate-100 px-3">
              <span className="ml-auto text-[10px] text-slate-400">
                {content.length} characters
              </span>
            </div>
          </div>

          <div className="mb-2 mt-5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">
              Publish to
            </span>
            <span className="text-[10px] text-slate-400">
              Select one or more
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((platform) => {
              const isSelected = selected.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelected((current) =>
                      current.includes(platform)
                        ? current.filter((item) => item !== platform)
                        : [...current, platform],
                    )
                  }
                  className={`flex h-10 items-center gap-2 rounded-lg border px-2.5 text-left text-xs transition ${isSelected ? "border-violet-300 bg-violet-50/60 text-violet-900" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  <PlatformIcon platform={platform} small />
                  <span>{platform}</span>
                  {isSelected && <b className="ml-auto text-violet-700">✓</b>}
                </button>
              );
            })}
          </div>

          {selected.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 border-t border-slate-100 pt-1">
              {selected.map((platform) => {
                const remaining = CHARACTER_LIMITS[platform] - content.length;
                const exceeded = remaining < 0;
                return (
                  <div
                    key={platform}
                    className={`flex h-6 items-center gap-2 text-[10px] ${exceeded ? "text-red-600" : "text-slate-500"}`}
                  >
                    <i
                      className={`h-1.5 w-1.5 rounded-full ${PLATFORM_COLORS[platform].split(" ")[0]}`}
                    />
                    {platform}
                    <span className="ml-auto">
                      {exceeded
                        ? `${Math.abs(remaining).toLocaleString()} over limit`
                        : `${remaining.toLocaleString()} left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <label className={`${labelClass} mt-4`} htmlFor="media-url">
            Media{" "}
            <span className="ml-1 font-normal text-slate-400">Optional</span>
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-2.5 text-sm text-slate-400"
            >
              ▧
            </span>
            <input
              id="media-url"
              type="url"
              placeholder="Paste an image URL"
              value={mediaUrl}
              onChange={(event) => setMediaUrl(event.target.value)}
              className={`${inputClass} pl-9`}
            />
          </div>
          {mediaUrl.trim() && (
            <div className="mt-2 flex min-h-16 items-center gap-2">
              <MediaImage
                key={mediaUrl.trim()}
                src={mediaUrl.trim()}
                label="Image preview"
                className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                onStatusChange={setImageStatus}
              />
              {imageStatus === "loading" && (
                <span className="text-[10px] text-slate-400">
                  Checking image URL…
                </span>
              )}
            </div>
          )}

          <label className={`${labelClass} mt-4`} htmlFor="schedule-time">
            Schedule for
          </label>
          <input
            id="schedule-time"
            type="datetime-local"
            value={scheduledAt}
            min={toLocalDateTimeInput(new Date())}
            onChange={(event) => setScheduledAt(event.target.value)}
            className={inputClass}
          />
          <p className="mb-3 mt-1.5 text-[10px] text-slate-400">
            Times shown in your local timezone · saved in UTC
          </p>
          {error && (
            <p
              role="alert"
              className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-700"
            >
              ⚠ {error}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white shadow-sm shadow-violet-200 transition hover:bg-violet-700 disabled:cursor-wait disabled:opacity-70"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Scheduling…
              </>
            ) : postToEdit ? (
              <>
                Save changes <span className="ml-auto text-sm">→</span>
              </>
            ) : (
              <>
                Schedule post <span className="ml-auto text-sm">→</span>
              </>
            )}
          </button>
          <p className="mb-0 mt-2.5 text-center text-[10px] text-slate-400">
            Your post will be added to the queue. You can edit it anytime.
          </p>
        </form>
      </section>
    </div>
  );
}
