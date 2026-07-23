"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  pdfUrl?: string | null;
  customerName: string;
}

export function SharePdfButton({ pdfUrl, customerName }: Props) {
  const handleShare = () => {
    if (navigator.share && pdfUrl) {
      navigator.share({ title: `Assessment PDF - ${customerName}`, url: window.location.origin + pdfUrl });
    } else if (pdfUrl) {
      navigator.clipboard.writeText(window.location.origin + pdfUrl);
      toast.success("PDF link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
      title="Share PDF"
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}
