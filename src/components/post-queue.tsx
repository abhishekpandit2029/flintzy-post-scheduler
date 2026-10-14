"use client";

import { useEffect, useMemo, useState } from "react";
import { formatPostTime, formatTimezone, getDayTitle } from "@/lib/post-utils";
import { PLATFORMS, STATUS_COLORS } from "@/constants/post-scheduler";
import type { Platform, Post } from "@/types/post";
import { PlatformIcon } from "@/components/platform-icon";

export function PostQueue({
  posts,
  retryingIds,
  onRetry,
}: {
  posts: Post[];
  retryingIds: string[];
  onRetry: (post: Post) => void;
}) {
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All platforms");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
    setPlatformFilter(params.get("platform") ?? "All platforms");
    setStatusFilter(params.get("status") ?? "All status");
    setFiltersReady(true);
  }, []);

  useEffect(() => {
    if (!filtersReady) return;
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (platformFilter !== "All platforms")
      params.set("platform", platformFilter);
    if (statusFilter !== "All status") params.set("status", statusFilter);
    const search = params.toString();
    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  }, [filtersReady, platformFilter, query, statusFilter]);

  const filtered = useMemo(
    () =>
      posts
        .filter(
          (post) =>
            (platformFilter === "All platforms" ||
              post.platforms.includes(platformFilter as Platform)) &&
            (statusFilter === "All status" || post.status === statusFilter) &&
            post.content.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [posts, platformFilter, query, statusFilter],
  );

  const groups = useMemo(
    () =>
      filtered.reduce<Record<string, Post[]>>((result, post) => {
        const day = getDayTitle(new Date(post.scheduledAt));
        (result[day] ||= []).push(post);
        return result;
      }, {}),
    [filtered],
  );

  function clearFilters() {
    setQuery("");
    setPlatformFilter("All platforms");
    setStatusFilter("All status");
  }

  const cardClass = "rounded-xl border border-slate-200 bg-white shadow-sm";

  return (
    <section className={cardClass}>
      <div className="flex items-center justify-between p-4 pb-3">
        <div>
          <h2 className="font-heading text-sm font-bold">
            Your queue{" "}
            <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
              {filtered.length}
            </span>
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            All your content, one clear view.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 px-4 pb-3">
        <label className="flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100">
          <span aria-hidden="true" className="text-lg text-slate-400 mb-1">
            ⌕
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
            placeholder="Search posts..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select
          aria-label="Filter by platform"
          className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-violet-400 sm:flex-none"
          value={platformFilter}
          onChange={(event) => setPlatformFilter(event.target.value)}
        >
          <option>All platforms</option>
          {PLATFORMS.map((platform) => (
            <option key={platform}>{platform}</option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-violet-400 sm:flex-none"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option>All status</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
          <span
            aria-hidden="true"
            className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-2xl text-violet-600"
          >
            ⌕
          </span>
          <strong className="text-sm font-semibold text-slate-800">
            {posts.length === 0 ? "Your queue is empty" : "No posts found"}
          </strong>
          <p className="mt-1.5 text-xs text-slate-500">
            {posts.length === 0
              ? "Scheduled posts will appear here."
              : "Try adjusting your search or filters."}
          </p>
          {posts.length > 0 && (
            <button
              onClick={clearFilters}
              className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-50"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="px-3 pb-2 sm:px-4">
          {Object.entries(groups).map(([day, dayPosts]) => (
            <div key={day} className="pt-4">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                <span>{day}</span>
                <i className="h-px flex-1 bg-slate-100" />
                <small className="font-normal text-slate-400">
                  {dayPosts.length} {dayPosts.length === 1 ? "post" : "posts"}
                </small>
              </div>
              {dayPosts.map((post) => (
                <article
                  key={post.id}
                  className="mb-2 flex items-start gap-2.5 rounded-lg border border-slate-200 p-3 transition hover:border-violet-200 sm:gap-3"
                >
                  <div className="w-12 shrink-0 pt-0.5">
                    <strong className="block text-[11px] font-semibold text-slate-700">
                      {formatPostTime(post.scheduledAt)}
                    </strong>
                    <span className="text-[9px] text-slate-400">
                      {formatTimezone(post.scheduledAt)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-1">
                      {post.platforms.map((platform) => (
                        <PlatformIcon
                          key={platform}
                          platform={platform}
                          small
                        />
                      ))}
                      <span
                        className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] capitalize ${STATUS_COLORS[post.status]}`}
                      >
                        <i className="h-1 w-1 rounded-full bg-current" />
                        {post.status}
                      </span>
                    </div>
                    <p className="break-words text-xs leading-relaxed text-slate-600">
                      {post.content}
                    </p>
                    {post.errorMessage && (
                      <p className="mt-1.5 text-[10px] text-red-600">
                        ⚠ {post.errorMessage}
                      </p>
                    )}
                    {post.mediaUrl && (
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        ▧ Image attached
                      </p>
                    )}
                  </div>
                  {post.status === "failed" && (
                    <button
                      onClick={() => onRetry(post)}
                      disabled={retryingIds.includes(post.id)}
                      className="shrink-0 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-700 disabled:opacity-50"
                    >
                      {retryingIds.includes(post.id) ? "Retrying…" : "↻ Retry"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="flex h-12 items-center border-t border-slate-100 px-3 text-[10px] text-slate-400 sm:px-4">
        Showing{" "}
        <strong className="mx-1 text-slate-600">{filtered.length}</strong> of{" "}
        <strong className="mx-1 text-slate-600">{posts.length}</strong>posts
      </div>
    </section>
  );
}
