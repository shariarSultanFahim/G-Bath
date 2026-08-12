"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, FileText, Download, Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { PdfPreviewModal } from "@/components/admin/pdf-preview-modal";
import { AssessmentModal } from "@/components/admin/assessment-modal";
import { DeleteConfirmationModal } from "@/components/admin/delete-confirmation-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminAssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const router = useRouter();

  const fetchAssessment = () => {
    fetch(`/api/assessments/${id}`)
      .then((res) => res.json())
      .then((data) => setAssessment(data));
  };

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/assessments/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete assessment");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Assessment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-assessments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      router.push("/admin/assessments");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    }
  });

  if (!assessment) return <div className="p-8 text-center text-xs text-muted-foreground">Loading assessment...</div>;

  const ex = assessment.existingBathroom || {};
  const wet = assessment.wetArea || {};
  const tiledWet = assessment.tiledWetArea || {};
  const dry = assessment.dryArea || {};
  const tiledDry = assessment.tiledDryArea || {};
  const up = assessment.upgrades || {};

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <Button asChild variant="ghost" size="sm" className="w-fit text-xs text-[#E8621A] p-0 hover:bg-transparent">
        <Link href="/admin/assessments">
          <ArrowLeft data-icon="inline-start" /> Back to Assessments
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assessment – {assessment.customer.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            Salesperson: {assessment.salesperson.name} · Date: {format(new Date(assessment.createdAt), "dd MMM yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted-foreground">#{id.slice(-4).toUpperCase()}</span>
          <Badge variant="success">{assessment.status}</Badge>
          {assessment.pdfUrl && <Badge variant="brand">PDF Ready</Badge>}
          
          <div className="ml-4 flex items-center gap-2 border-l border-border pl-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="h-8 text-xs font-semibold"
            >
              <Edit className="size-3.5 mr-1.5" /> Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="h-8 text-xs font-semibold bg-rose-600 hover:bg-rose-700"
            >
              <Trash2 className="size-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <AssessmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{ id: assessment.id, status: assessment.status, pdfUrl: assessment.pdfUrl }}
        onSuccess={fetchAssessment}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        entityType="assessment"
        entityName={`Assessment for ${assessment.customer.name}`}
        isDeleting={deleteMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Full Assessment Readonly View */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Assessment Section */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                ASSESSMENT
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">BATH SIZE</span><span className="font-semibold text-foreground">{ex.bathSize || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">SHOWER SIZE</span><span className="font-semibold text-foreground">{ex.showerSize || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">WALL MATERIAL</span><span className="font-semibold text-foreground">{ex.wallMaterial || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">FLOORING SQ FT</span><span className="font-semibold text-foreground">{ex.flooringSquareFt || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">FLOORING MATERIAL</span><span className="font-semibold text-foreground">{ex.flooringMaterial || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">MEASUREMENTS</span><span className="font-semibold text-foreground">{ex.measurements || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">VANITY SIZE</span><span className="font-semibold text-foreground">{ex.vanitySize || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">NOTES</span><span className="font-semibold text-foreground">{ex.notes || "—"}</span></div>
            </CardContent>
          </Card>

          {/* Wet Area Section */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                WET AREA (ACRYLIC)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">BATH</span><span className="font-semibold text-foreground">{wet.includeBath ? `Yes - ${wet.bathDetails || ""}` : "No"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">SHOWER</span><span className="font-semibold text-foreground">{wet.includeShower ? `Yes - ${wet.showerDetails || ""}` : "No"}</span></div>
              <div className="col-span-2"><span className="text-muted-foreground block text-[10px] uppercase font-bold">ACRYLIC PANEL SYSTEM</span><span className="font-semibold text-foreground">{wet.acrylicTilePanel || "—"}</span></div>
            </CardContent>
          </Card>

          {/* Tiled Wet Area Section */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                TILED WET AREA
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">TYPE</span><span className="font-semibold text-foreground">{tiledWet.bathOrShower || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">WET AREA SIZE</span><span className="font-semibold text-foreground">{tiledWet.wetAreaSize || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">UPGRADES</span><span className="font-semibold text-foreground">{tiledWet.upgrades?.join(", ") || "None"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">NOTES</span><span className="font-semibold text-foreground">{tiledWet.notes || "—"}</span></div>
            </CardContent>
          </Card>

          {/* Dry Area Section */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                DRY AREA (ACRYLIC)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">PACKAGE</span><span className="font-semibold text-foreground">{dry.package || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">VANITY STYLE</span><span className="font-semibold text-foreground">{dry.vanityStyle || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">MIRROR</span><span className="font-semibold text-foreground">{dry.mirror || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">VANITY LIGHTING</span><span className="font-semibold text-foreground">{dry.vanityLighting || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">UPGRADE LIGHTING</span><span className="font-semibold text-foreground">{dry.upgradeLighting || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">TOWEL BARS</span><span className="font-semibold text-foreground">{dry.towelBars || "—"}</span></div>
              <div className="col-span-2"><span className="text-muted-foreground block text-[10px] uppercase font-bold">COMMENTS</span><span className="font-semibold text-foreground">{dry.comments || "—"}</span></div>
            </CardContent>
          </Card>

          {/* Tiled Dry Area Section */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                TILED DRY AREA
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">FLOORING SELECTION</span><span className="font-semibold text-foreground">{tiledDry.flooringSelection || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">FLOORING NOTES</span><span className="font-semibold text-foreground">{tiledDry.flooringNotes || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">TOILET SELECTION</span><span className="font-semibold text-foreground">{tiledDry.toiletSelection || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">VANITY</span><span className="font-semibold text-foreground">{tiledDry.vanityStyle ? `${tiledDry.vanityStyle} (${tiledDry.vanitySize || ""})` : "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">MIRROR CHOICE</span><span className="font-semibold text-foreground">{tiledDry.mirrorChoice || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">LIGHTING CHOICE</span><span className="font-semibold text-foreground">{tiledDry.lightingChoice || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">TOWEL BAR FINISH</span><span className="font-semibold text-foreground">{tiledDry.towelBarFinish || "—"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">UPGRADES</span><span className="font-semibold text-foreground">{tiledDry.upgrades?.join(", ") || "None"}</span></div>
              <div className="col-span-2"><span className="text-muted-foreground block text-[10px] uppercase font-bold">NOTES</span><span className="font-semibold text-foreground">{tiledDry.notes || "—"}</span></div>
            </CardContent>
          </Card>

          {/* Upgrades Section */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                UPGRADES
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">PACKAGE UPGRADES</span><span className="font-semibold text-foreground">{dry.packageUpgrades?.join(", ") || "None"}</span></div>
              <div><span className="text-muted-foreground block text-[10px] uppercase font-bold">GLASS DOOR</span><span className="font-semibold text-foreground">{up.glassDoor || "—"}</span></div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Generated PDF & Uploaded Photos */}
        <div className="flex flex-col gap-6">
          {/* PDF Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                GENERATED PDF
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-3">
              {assessment.pdfUrl ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-orange-50/70 p-3 border border-orange-100">
                    <FileText className="size-6 text-[#E8621A]" />
                    <div className="overflow-hidden flex flex-col">
                      <span className="text-xs font-bold text-foreground truncate">
                        Assessment_{assessment.customer.name.replace(/\s+/g, "_")}.pdf
                      </span>
                      <span className="text-[10px] text-muted-foreground">Ready</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsPreviewOpen(true)}
                    className="w-full bg-[#E8621A] hover:bg-orange-600 text-white font-semibold text-xs"
                  >
                    <Eye data-icon="inline-start" /> Open PDF Sheet
                  </Button>

                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <a href={assessment.pdfUrl} download>
                      <Download data-icon="inline-start" /> Download PDF
                    </a>
                  </Button>
                </>
              ) : (
                <p className="text-xs text-muted-foreground italic">No PDF generated yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Photos Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                UPLOADED PHOTOS ({assessment.photos?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!assessment.photos || assessment.photos.length === 0 ? (
                <p className="text-xs text-muted-foreground italic py-4 text-center">No photos uploaded.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {assessment.photos.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={`Photo ${i + 1}`} className="h-24 w-full rounded-xl object-cover border border-border hover:opacity-90 transition-opacity" />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <PdfPreviewModal
        pdfUrl={assessment.pdfUrl}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
