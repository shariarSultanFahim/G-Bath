"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Eye, FileText, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

import { DataPagination } from "@/components/admin/data-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentItem {
  id: string;
  customer: { name: string };
  salesperson: { name: string };
  appointment?: { date: string };
  submittedAt?: string;
  status: string;
  pdfUrl?: string;
}

export default function AdminAssessmentsPage() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault("ALL"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const { data, isLoading } = useQuery({
    queryKey: ["admin-assessments", search, statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/assessments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch assessments");
      return res.json();
    },
  });

  const assessments: AssessmentItem[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Assessments</h1>
          <p className="text-xs text-muted-foreground">All bathroom renovation reports and PDF documents.</p>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value || null);
              setPage(1);
            }}
            placeholder="Search by customer, salesperson..."
            className="pl-9 text-xs"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50">
          {["ALL", "SUBMITTED"].map((st) => (
            <Button
              key={st}
              variant="ghost"
              size="sm"
              onClick={() => {
                setStatusFilter(st === "ALL" ? null : st);
                setPage(1);
              }}
              className={`h-7 px-3 text-xs font-semibold rounded-lg transition-all ${statusFilter === st
                ? "bg-background text-[#E8621A] shadow-sm font-bold"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {st === "ALL" ? "All" : st.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Assessments Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-[10px]">ID</TableHead>
              <TableHead className="text-[10px]">CUSTOMER</TableHead>
              <TableHead className="text-[10px]">SALESPERSON</TableHead>
              <TableHead className="text-[10px]">APPT DATE</TableHead>
              <TableHead className="text-[10px]">SUBMITTED</TableHead>
              <TableHead className="text-[10px]">STATUS</TableHead>
              <TableHead className="text-[10px]">PDF</TableHead>
              <TableHead className="text-[10px] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="p-4">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : assessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-8">
                  No assessments found.
                </TableCell>
              </TableRow>
            ) : (
              assessments.map((ass) => (
                <TableRow key={ass.id}>
                  <TableCell className="font-mono font-bold text-xs text-muted-foreground">
                    #{ass.id.slice(-4).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-bold text-xs">{ass.customer.name}</TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5 bg-muted text-[10px] font-bold">
                        <AvatarFallback>{ass.salesperson.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{ass.salesperson.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ass.appointment?.date ? format(new Date(ass.appointment.date), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ass.submittedAt ? format(new Date(ass.submittedAt), "dd MMM yyyy") : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="text-[10px]">
                      {ass.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ass.pdfUrl ? (
                      <Badge variant="brand" className="text-[10px]">
                        <FileText data-icon="inline-start" /> Ready
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
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
    </div>
  );
}
