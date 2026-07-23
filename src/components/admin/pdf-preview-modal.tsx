"use client";

import { Download, Share2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface Props {
  pdfUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PdfPreviewModal({ pdfUrl, isOpen, onClose }: Props) {
  if (!pdfUrl) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-4xl flex flex-col justify-between">
        <SheetHeader className="pb-3 border-b border-border">
          <SheetTitle>PDF Assessment Preview</SheetTitle>
          <SheetDescription>
            Interactive view of the generated bathroom assessment report.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 my-4 w-full rounded-xl bg-muted overflow-hidden border border-border min-h-[550px]">
          <iframe src={pdfUrl} className="h-full w-full border-none" title="PDF Preview" />
        </div>

        <SheetFooter className="pt-3 border-t border-border flex justify-end gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={pdfUrl} download>
              <Download data-icon="inline-start" /> Download PDF
            </a>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: "Assessment PDF", url: window.location.origin + pdfUrl });
              }
            }}
            className="bg-orange-100 text-[#E8621A] hover:bg-orange-200"
          >
            <Share2 data-icon="inline-start" /> Share
          </Button>

          <Button variant="default" size="sm" onClick={onClose}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
