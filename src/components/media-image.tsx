"use client";

import { useEffect, useState } from "react";

export function MediaImage({
  src,
  className,
  label = "Post image",
  onStatusChange,
}: {
  src: string;
  className: string;
  label?: string;
  onStatusChange?: (status: "loading" | "loaded" | "broken") => void;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "broken">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    const image = new window.Image();
    const handleLoad = () => {
      if (!active) return;
      setStatus("loaded");
      onStatusChange?.("loaded");
    };
    const handleError = () => {
      if (!active) return;
      setStatus("broken");
      onStatusChange?.("broken");
    };

    setStatus("loading");
    onStatusChange?.("loading");

    image.onload = handleLoad;
    image.onerror = handleError;
    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) handleLoad();
      else handleError();
    }

    return () => {
      active = false;
      image.onload = null;
      image.onerror = null;
    };
  }, [onStatusChange, src]);

  if (status === "broken") {
    return (
      <span
        role="status"
        className="inline-flex items-center gap-1.5 text-[10px] text-red-600"
      >
        <span aria-hidden="true">⚠</span> Image link is broken or unavailable
      </span>
    );
  }

  if (status === "loading") {
    return (
      <span
        role="status"
        aria-label="Checking image URL"
        className={`${className} grid place-items-center bg-slate-50 text-[9px] text-slate-400`}
      >
        …
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={label}
      onError={() => {
        setStatus("broken");
        onStatusChange?.("broken");
      }}
      className={`${className} block`}
    />
  );
}
