import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

export const siteConfig: SiteConfig = {
  name: "Good Bathroom Renos Salesperson Assessment",
  description: "Good Bathroom Renos Salesperson Assessment",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: "",
  locale: "en",
  themeColor: "#576045",
  keywords: ["nextjs", "typescript", "tailwindcss", "boilerplate", "starter"],
  social: {
    twitter: "",
    github: "",
    linkedin: ""
  },
  ogImage: "/og.jpg"
} as const;
