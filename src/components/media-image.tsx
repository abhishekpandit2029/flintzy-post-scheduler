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
    setStatus("loading");
    onStatusChange?.("loading");
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

  return (
    <img
      src={src}
      alt={label}
      onLoad={() => {
        setStatus("loaded");
        onStatusChange?.("loaded");
      }}
      onError={() => {
        setStatus("broken");
        onStatusChange?.("broken");
      }}
      className={`${className} ${status === "loaded" ? "block" : "hidden"}`}
    />
  );
}
