"use client";

import { useCallback, useEffect, useState } from "react";
import { POST_STORAGE_KEY } from "@/constants/post-scheduler";
import { isPost } from "@/lib/post-utils";
import type { Post } from "@/types/post";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ready, setReady] = useState(false);
  const [retryingIds, setRetryingIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(POST_STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setPosts(parsed.filter(isPost));
      }
    } catch {
      window.localStorage.removeItem(POST_STORAGE_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready)
      window.localStorage.setItem(POST_STORAGE_KEY, JSON.stringify(posts));
  }, [posts, ready]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => {
      const now = Date.now();
      const dueIds = posts
        .filter(
          (post) =>
            post.status === "scheduled" && Date.parse(post.scheduledAt) <= now,
        )
        .map((post) => post.id);
      if (!dueIds.length) return;

      const failures = new Map(dueIds.map((id) => [id, Math.random() < 0.2]));
      setPosts((current) =>
        current.map((post) => {
          if (!failures.has(post.id) || post.status !== "scheduled")
            return post;
          return failures.get(post.id)
            ? {
                ...post,
                status: "failed",
                errorMessage:
                  "Publishing failed. Retry this post to try again.",
              }
            : { ...post, status: "published", errorMessage: undefined };
        }),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [posts, ready]);

  const addPost = useCallback((post: Post) => {
    setPosts((current) => [post, ...current]);
  }, []);

  const retryPost = useCallback(async (post: Post) => {
    setRetryingIds((current) => [...current, post.id]);
    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? {
              ...item,
              status: "scheduled",
              scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
              errorMessage: undefined,
            }
          : item,
      ),
    );

    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    if (Math.random() < 0.2) {
      setPosts((current) =>
        current.map((item) =>
          item.id === post.id
            ? {
                ...item,
                status: "failed",
                errorMessage: "Retry failed. Please try again.",
              }
            : item,
        ),
      );
    }
    setRetryingIds((current) => current.filter((id) => id !== post.id));
  }, []);

  return { posts, addPost, retryPost, retryingIds, ready };
}
