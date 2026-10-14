import { PlatformIcon } from "@/components/platform-icon";
import { PLATFORMS } from "@/constants/post-scheduler";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 pt-6 lg:flex">
      <a
        href="#"
        className="mb-8 flex items-center gap-2 px-2 font-heading text-xl font-extrabold tracking-tight text-slate-900"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-600 text-xl leading-none text-white shadow-md shadow-violet-200">
          f
        </span>
        <span>
          flintzy<span className="text-violet-600">.</span>
        </span>
      </a>

      <div className="mb-8 flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-100 font-semibold text-violet-700">
          S
        </span>
        <span>
          <strong className="block text-xs font-semibold">Studio North</strong>
          <small className="mt-1 block text-[11px] text-slate-400">
            Workspace
          </small>
        </span>
      </div>

      <p className="mb-2 px-2 text-[10px] font-bold tracking-[.14em] text-slate-400">
        WORKSPACE
      </p>
      <nav aria-label="Workspace" className="space-y-1">
        <span
          aria-current="page"
          className="flex h-10 items-center gap-3 rounded-lg bg-violet-50 px-3 text-xs font-medium text-violet-700"
        >
          <span className="w-4 text-center text-base">◷</span>Content planner
        </span>
      </nav>

      <div className="mb-2 mt-8 px-2 text-[10px] font-bold tracking-[.12em] text-slate-400">
        CONNECTED CHANNELS
      </div>
      {PLATFORMS.map((platform) => (
        <div
          key={platform}
          className="flex h-9 items-center gap-2.5 px-2 text-xs text-slate-600"
        >
          <PlatformIcon platform={platform} small />
          {platform}
          <i className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      ))}

      <div className="mt-auto">
        <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
          <span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-violet-100 text-violet-700">
            ✳
          </span>
          <strong className="text-xs">Need a hand?</strong>
          <p className="my-1.5 text-[11px] leading-relaxed text-slate-500">
            Visit our help center for tips and guides.
          </p>
          <span className="text-[11px] font-semibold text-violet-700">
            Help center ↗
          </span>
        </div>
        <div className="flex items-center gap-2.5 border-t border-slate-100 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-800">
            JD
          </span>
          <span>
            <strong className="block text-xs font-semibold">Jamie Davis</strong>
            <small className="mt-1 block text-[10px] text-slate-400">
              Free plan
            </small>
          </span>
        </div>
      </div>
    </aside>
  );
}
