"use client";

import { X, Download, Share2 } from "lucide-react";

interface Props {
  pdfUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PdfPreviewModal({ pdfUrl, isOpen, onClose }: Props) {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-lg">PDF Preview</h3>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-[500px] w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
          <iframe src={pdfUrl} className="h-full w-full border-none" title="PDF Preview" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <a
            href={pdfUrl}
            download
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" /> Download
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Assessment PDF", url: window.location.origin + pdfUrl });
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-orange-100 px-4 py-2.5 text-xs font-bold text-[#E8621A] hover:bg-orange-200"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
