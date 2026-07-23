import type { SiteConfig } from "@/types/site-config";
import { env } from "@/env";

export const siteConfig: SiteConfig = {
  name: "Rise & Impact Admin Panel",
  description: "Production-ready Next.js 16+ starter built with Tailwind CSS 4 and TypeScript.",
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
