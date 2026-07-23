"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, UserX, UserCheck, Eye, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

import { CreateSalespersonModal } from "@/components/admin/create-salesperson-modal";
import { ResetPasswordModal } from "@/components/admin/reset-password-modal";
import { DataPagination } from "@/components/admin/data-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "ACTIVE" | "SUSPENDED";
  assessments?: { id: string }[];
}

export default function AdminSalespersonsPage() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<Salesperson | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-salespersons", search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/admin/salespersons?${params}`);
      if (!res.ok) throw new Error("Failed to fetch salespersons");
      return res.json();
    },
  });

  const salespersons: Salesperson[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const toggleMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
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
      toast.success(`Salesperson ${newStatus.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["admin-salespersons"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Salespersons</h1>
          <p className="text-xs text-muted-foreground">Manage sales team accounts and status.</p>
        </div>
        <Button
          onClick={() => setIsCreateSheetOpen(true)}
          className="bg-[#E8621A] hover:bg-orange-600 text-white font-semibold text-xs"
        >
          <Plus data-icon="inline-start" /> Create Salesperson
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value || null);
            setPage(1);
          }}
          placeholder="Search by name, email, or phone..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-[10px]">NAME</TableHead>
              <TableHead className="text-[10px]">EMAIL</TableHead>
              <TableHead className="text-[10px]">PHONE</TableHead>
              <TableHead className="text-[10px]">STATUS</TableHead>
              <TableHead className="text-[10px]">TOTAL ASSESSMENTS</TableHead>
              <TableHead className="text-[10px] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="p-4">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : salespersons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                  No salespersons found.
                </TableCell>
              </TableRow>
            ) : (
              salespersons.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-xs">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 bg-orange-100 text-[#E8621A] font-bold text-xs">
                        {s.avatar && <AvatarImage src={s.avatar} alt={s.name} />}
                        <AvatarFallback>{s.name[0]}</AvatarFallback>
                      </Avatar>
                      <Link href={`/admin/salespersons/${s.id}`} className="font-bold text-foreground hover:text-[#E8621A]">
                        {s.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.email}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.phone || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "ACTIVE" ? "success" : "destructive"}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs">{s.assessments?.length || 0}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      title="View Details"
                      className="size-8 text-muted-foreground hover:text-[#E8621A]"
                    >
                      <Link href={`/admin/salespersons/${s.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setResetTarget(s)}
                      title="Reset Password"
                      className="size-8 text-muted-foreground hover:text-amber-600"
                    >
                      <KeyRound className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleMutation.mutate({ id: s.id, currentStatus: s.status })}
                      title={s.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                      className="size-8 text-muted-foreground hover:text-rose-600"
                    >
                      {s.status === "ACTIVE" ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Server Side Pagination */}
        <DataPagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      <CreateSalespersonModal
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["admin-salespersons"] })}
      />

      <ResetPasswordModal
        salesperson={resetTarget}
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
      />
    </div>
  );
}
