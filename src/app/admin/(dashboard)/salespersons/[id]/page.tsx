"use client";

import { use, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, UserCheck, UserX, Eye, FileText, KeyRound } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ResetPasswordModal } from "@/components/admin/reset-password-modal";

export default function AdminSalespersonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: salesperson, isLoading } = useQuery({
    queryKey: ["admin-salesperson", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/salespersons/${id}`);
      if (!res.ok) throw new Error("Failed to fetch salesperson details");
      return res.json();
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (currentStatus: string) => {
      const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
      const res = await fetch(`/api/admin/salespersons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return newStatus;
    },
    onSuccess: (newStatus) => {
      toast.success(`Salesperson account is now ${newStatus.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["admin-salesperson", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-salespersons"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!salesperson) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Salesperson not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/salespersons">Back to Salespersons</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="w-fit text-xs text-[#E8621A] p-0 hover:bg-transparent">
        <Link href="/admin/salespersons">
          <ArrowLeft data-icon="inline-start" /> Back to Salespersons
        </Link>
      </Button>

      {/* Header Profile Card */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-primary/20 bg-orange-50 text-[#E8621A] font-extrabold text-2xl">
              {salesperson.avatar && <AvatarImage src={salesperson.avatar} alt={salesperson.name} />}
              <AvatarFallback>{salesperson.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{salesperson.name}</h1>
                <Badge variant={salesperson.status === "ACTIVE" ? "success" : "destructive"}>
                  {salesperson.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Salesperson Role · Added on {format(new Date(salesperson.createdAt), "d MMMM yyyy")}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                <Mail className="size-4 text-[#E8621A]" />
                <span className="font-semibold">{salesperson.email}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
                <Phone className="size-4 text-[#E8621A]" />
                <span className="font-semibold">{salesperson.phone || "No phone"}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetOpen(true)}
              className="text-xs font-semibold border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <KeyRound data-icon="inline-start" /> Reset Password
            </Button>

            <Button
              variant={salesperson.status === "ACTIVE" ? "destructive" : "default"}
              size="sm"
              onClick={() => toggleStatusMutation.mutate(salesperson.status)}
              disabled={toggleStatusMutation.isPending}
              className="text-xs font-semibold"
            >
              {salesperson.status === "ACTIVE" ? (
                <>
                  <UserX data-icon="inline-start" /> Suspend Account
                </>
              ) : (
                <>
                  <UserCheck data-icon="inline-start" /> Activate Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Completed Assessments List */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">
          Completed Assessments ({salesperson.assessments?.length || 0})
        </h2>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-[10px]">ID</TableHead>
                <TableHead className="text-[10px]">CUSTOMER</TableHead>
                <TableHead className="text-[10px]">DATE</TableHead>
                <TableHead className="text-[10px]">STATUS</TableHead>
                <TableHead className="text-[10px]">PDF REPORT</TableHead>
                <TableHead className="text-[10px] text-right">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!salesperson.assessments || salesperson.assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                    No assessments completed by this salesperson yet.
                  </TableCell>
                </TableRow>
              ) : (
                salesperson.assessments.map((ass: any) => (
                  <TableRow key={ass.id}>
                    <TableCell className="font-mono font-bold text-xs text-muted-foreground">
                      #{ass.id.slice(-4).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-bold text-xs">{ass.customer?.name || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(ass.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="text-[10px]">
                        {ass.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ass.pdfUrl ? (
                        <Badge variant="brand" className="text-[10px]">
                          <FileText data-icon="inline-start" /> PDF Ready
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-[#E8621A]">
                        <Link href={`/admin/assessments/${ass.id}`}>
                          <Eye data-icon="inline-start" /> View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ResetPasswordModal
        salesperson={salesperson ? { id: salesperson.id, name: salesperson.name, email: salesperson.email } : null}
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
      />
    </div>
  );
}
