import { SiFacebook, SiInstagram, SiTiktok, SiX } from "react-icons/si";
import type { IconType } from "react-icons";
import type { Platform } from "@/types/post";

export const PLATFORM_ICONS: Record<Platform, IconType> = {
  Instagram: SiInstagram,
  TikTok: SiTiktok,
  Facebook: SiFacebook,
  X: SiX,
};
