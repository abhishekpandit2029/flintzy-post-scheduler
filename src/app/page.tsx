"use client";

import { useEffect, useState } from "react";
import { PostComposerModal } from "@/components/post-composer-modal";
import { PostQueue } from "@/components/post-queue";
import { PostStats } from "@/components/post-stats";
import { Sidebar } from "@/components/sidebar";
import { usePosts } from "@/hooks/use-posts";
import type { Post } from "@/types/post";

export default function Home() {
  const { posts, addPost, updatePost, retryPost, retryingIds } = usePosts();
  const [composerOpen, setComposerOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [notice, setNotice] = useState("");

  function handlePostCreated(post: Post) {
    addPost(post);
    setNotice("Post added to your queue");
    window.setTimeout(() => setNotice(""), 3200);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <section className="lg:ml-60">
        <div className="mx-auto max-w-[1500px] px-4 pb-3 pt-7 text-[13px] sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-5 flex items-center gap-2 text-[13px] text-slate-400"
              >
                <span>Workspace</span>
                <span aria-hidden="true" className="text-slate-300">
                  /
                </span>
                <span
                  aria-current="page"
                  className="font-medium text-slate-700"
                >
                  Content planner
                </span>
              </nav>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[.15em] text-slate-400">
                <i className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                YOUR CONTENT, ALL IN ONE PLACE
              </p>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                Content planner
              </h1>
              <p className="mt-1 text-[13px] text-slate-500">
                Plan, schedule, and manage your content across every channel.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  setPostToEdit(null);
                  setComposerOpen(true);
                }}
                className="flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-4 text-[13px] font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-700"
              >
                <span className="text-base leading-none">+</span>Create post
              </button>
            </div>
          </div>

          <PostStats posts={posts} />
          <PostQueue
            posts={posts}
            retryingIds={retryingIds}
            onRetry={retryPost}
            onEdit={(post) => {
              setPostToEdit(post);
              setComposerOpen(true);
            }}
          />

          <footer className="flex min-h-14 flex-col items-center justify-center gap-2 py-3 text-xs text-center text-slate-400 sm:flex-row sm:justify-between sm:text-left">
            <span>© 2026 Flintzy. Made for the stories you share.</span>
            <div className="flex gap-4">
              <span>Help center</span>
              <span>Feedback</span>
              <span>Changelog</span>
            </div>
          </footer>
        </div>
      </section>

      <PostComposerModal
        open={composerOpen}
        onClose={() => {
          setComposerOpen(false);
          setPostToEdit(null);
        }}
        onCreated={handlePostCreated}
        postToEdit={postToEdit}
        onUpdated={updatePost}
      />

      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-lg"
        >
          <span className="text-emerald-300">✓</span>
          {notice}
        </div>
      )}
    </main>
  );
}
