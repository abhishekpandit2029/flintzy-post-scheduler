import { PLATFORM_ICONS } from "@/constants/platform-icons";
import { PLATFORM_COLORS } from "@/constants/post-scheduler";
import type { Platform } from "@/types/post";

export function PlatformIcon({
  platform,
  small = false,
}: {
  platform: Platform;
  small?: boolean;
}) {
  const Icon = PLATFORM_ICONS[platform];
  return (
    <span
      aria-label={platform}
      title={platform}
      className={`inline-grid shrink-0 place-items-center rounded-md ${PLATFORM_COLORS[platform]} ${small ? "h-5 w-5" : "h-7 w-7"}`}
    >
      <Icon aria-hidden="true" className={small ? "h-3 w-3" : "h-4 w-4"} />
    </span>
  );
}
