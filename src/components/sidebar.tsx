"use client";

import { useEffect, useState } from "react";

function Brand({
  onClick,
  tabIndex,
}: {
  onClick?: () => void;
  tabIndex?: number;
}) {
  return (
    <a
      href="#"
      onClick={onClick}
      tabIndex={tabIndex}
      className="flex items-center gap-2 font-heading text-xl font-extrabold tracking-tight text-slate-900"
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-violet-600 text-xl leading-none text-white shadow-md shadow-violet-200">
        f
      </span>
      <span>
        flintzy<span className="text-violet-600">.</span>
      </span>
    </a>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-workspace-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-lg text-slate-700 hover:bg-slate-50"
        >
          {mobileOpen ? "×" : "☰"}
        </button>
      </header>

      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          tabIndex={mobileOpen ? 0 : -1}
          className="absolute inset-0 h-full w-full cursor-default bg-slate-950/35"
        />
        <aside
          id="mobile-workspace-navigation"
          aria-label="Mobile workspace sidebar"
          className={`relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white px-4 pt-5 shadow-xl transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-8 flex items-center justify-between px-2">
            <Brand
              onClick={() => setMobileOpen(false)}
              tabIndex={mobileOpen ? 0 : -1}
            />
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileOpen(false)}
              tabIndex={mobileOpen ? 0 : -1}
              className="grid h-8 w-8 place-items-center rounded-lg text-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          </div>
          <p className="mb-2 px-2 text-[10px] font-bold tracking-[.14em] text-slate-400">
            WORKSPACE
          </p>
          <nav
            aria-label="Mobile workspace"
            onClick={() => setMobileOpen(false)}
            className="space-y-1"
          >
            <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600">
              <span className="w-4 text-center text-base">⌂</span>Overview
            </span>
            <span
              aria-current="page"
              className="flex h-10 items-center gap-2 rounded-lg bg-violet-50 px-3 text-[13px] font-medium text-violet-700"
            >
              <span className="w-4 text-center text-base">◷</span>Content
              planner
            </span>
            <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600">
              <span className="w-4 text-center text-base">▥</span>Analytics
            </span>
            <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600">
              <span className="w-4 text-center text-base">▤</span>Posts
            </span>
            <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600">
              <span className="w-4 text-center text-base">◎</span>Channels
            </span>
          </nav>
        </aside>
      </div>

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-slate-200 bg-white px-4 pt-6 lg:flex">
        <div className="mb-8 px-2">
          <Brand />
        </div>

        <p className="mb-2 px-2 text-[10px] font-bold tracking-[.14em] text-slate-400">
          WORKSPACE
        </p>
        <nav aria-label="Workspace" className="space-y-1">
          <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <span className="w-4 text-center text-base">⌂</span>Overview
          </span>
          <span
            aria-current="page"
            className="flex h-10 items-center gap-2 rounded-lg bg-violet-50 px-3 text-[13px] font-medium text-violet-700"
          >
            <span className="w-4 text-center text-base">◷</span>Content planner
          </span>
          <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <span className="w-4 text-center text-base">▥</span>Analytics
          </span>
          <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <span className="w-4 text-center text-base">▤</span>Posts
          </span>
          <span className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <span className="w-4 text-center text-base">◎</span>Channels
          </span>
        </nav>

        <div className="mt-auto">
          <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50/60 p-3.5">
            <span className="mb-2 grid h-7 w-7 place-items-center rounded-lg bg-violet-100 text-violet-700">
              ✳
            </span>
            <strong className="text-[13px]">Need a hand?</strong>
            <p className="my-1.5 text-xs leading-relaxed text-slate-500">
              Visit our help center for tips and guides.
            </p>
            <span className="text-xs font-semibold text-violet-700">
              Help center ↗
            </span>
          </div>
          <div className="flex items-center gap-2.5 border-t border-slate-100 py-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-800">
              JD
            </span>
            <span>
              <strong className="block text-[13px] font-semibold">
                Jamie Davis
              </strong>
              <small className="mt-1 block text-[10px] text-slate-400">
                Free plan
              </small>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
