import type { Post } from "@/types/post";
import { POST_STAT_CARDS } from "@/constants/post-scheduler";

export function PostStats({ posts }: { posts: Post[] }) {
  const stats = POST_STAT_CARDS.map((stat) => ({
    ...stat,
    value: posts.filter((post) => post.status === stat.status).length,
  }));

  return (
    <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex min-h-[78px] items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
        >
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl text-base ${stat.color}`}
          >
            {stat.icon}
          </span>
          <div>
            <small className="block text-[11px] text-slate-500">
              {stat.label}
            </small>
            <strong className="mt-0.5 block font-heading text-lg font-bold">
              {stat.value}
            </strong>
          </div>
          <span className="ml-auto self-end pb-1 text-[10px] text-slate-400">
            {stat.note}
          </span>
        </div>
      ))}
    </div>
  );
}
