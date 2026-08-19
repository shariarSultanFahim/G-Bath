"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";

export interface AssessmentData {
  id: string;
  status: string;
  pdfUrl?: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: AssessmentData | null;
}

export function AssessmentModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [status, setStatus] = useState("SUBMITTED");
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      setStatus(initialData.status || "SUBMITTED");
      // Resolve relative PDF paths to full URLs using the site base URL
      const rawPdf = initialData.pdfUrl || "";
      if (rawPdf && rawPdf.startsWith("/")) {
        const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
        setPdfUrl(`${baseUrl}${rawPdf}`);
      } else {
        setPdfUrl(rawPdf);
      }
    } else if (isOpen && !initialData) {
      setStatus("SUBMITTED");
      setPdfUrl("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing && initialData ? `/api/assessments/${initialData.id}` : "/api/assessments";
      const method = isEditing ? "PATCH" : "POST";
      
      const bodyData = { 
        status, 
        pdfUrl: pdfUrl.trim() !== "" ? pdfUrl.trim() : null 
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || `Failed to ${isEditing ? "update" : "create"} assessment`);
      } else {
        toast.success(`Assessment ${isEditing ? "updated" : "created"}!`);
        queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        if (isEditing && initialData?.id) {
          queryClient.invalidateQueries({ queryKey: ["admin-assessment", initialData.id] });
        }
        onClose();
        onSuccess?.();
      }
    } catch {
      toast.error(`An error occurred while ${isEditing ? "updating" : "creating"} assessment`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle>{isEditing ? "Edit Assessment" : "Create Assessment"}</SheetTitle>
            <SheetDescription>
              {isEditing 
                ? "Update assessment status and PDF report link." 
                : "Manually add a new assessment record."}
            </SheetDescription>
          </SheetHeader>

          <form id="assessment-form" onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="ass-status">Status</FieldLabel>
                <Input
                  id="ass-status"
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="e.g. SUBMITTED"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="ass-pdf">PDF URL</FieldLabel>
                <Input
                  id="ass-pdf"
                  type="url"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="https://.../report.pdf"
                />
              </Field>
            </FieldGroup>
          </form>
        </div>

        <SheetFooter className="pt-4 border-t border-border flex gap-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="assessment-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Saving..." : (isEditing ? "Save Changes" : "Create Assessment")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
