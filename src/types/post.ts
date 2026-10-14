export type Platform = "Facebook" | "Instagram" | "X" | "TikTok";
export type PostStatus = "scheduled" | "published" | "failed";

export type Post = {
  id: string;
  content: string;
  platforms: Platform[];
  mediaUrl?: string;
  scheduledAt: string;
  status: PostStatus;
  errorMessage?: string;
};
