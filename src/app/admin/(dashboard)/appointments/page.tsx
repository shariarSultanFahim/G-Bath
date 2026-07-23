"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Plus, Calendar, CheckCircle2, Clock, XCircle, MoreVertical, CalendarClock, Ban, FileText, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

import { CreateAppointmentModal } from "@/components/admin/create-appointment-modal";
import { RescheduleAppointmentModal } from "@/components/admin/reschedule-appointment-modal";
import { DataPagination } from "@/components/admin/data-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppointmentItem {
  id: string;
  date: string;
  time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  customer: { id: string; name: string; phone: string };
  salesperson: { id: string; name: string; avatar?: string };
  assessments?: { id: string; pdfUrl?: string }[];
}

export default function AdminAppointmentsPage() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsString.withDefault("ALL"));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentItem | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-appointments", search, statusFilter, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/appointments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  const appointments: AppointmentItem[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      if (!res.ok) throw new Error("Failed to cancel appointment");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Appointment cancelled");
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: () => {
      toast.error("Failed to cancel appointment");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Appointments</h1>
          <p className="text-xs text-muted-foreground">
            Schedule site visits and manage salesperson appointments.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateSheetOpen(true)}
          className="bg-[#E8621A] hover:bg-orange-600 text-white font-semibold text-xs"
        >
          <Plus data-icon="inline-start" /> New Appointment
        </Button>
      </div>

      {/* Filter and Search Bar */}
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
          {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map((st) => (
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
              {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-[10px]">CUSTOMER</TableHead>
              <TableHead className="text-[10px]">SALESPERSON</TableHead>
              <TableHead className="text-[10px]">DATE & TIME</TableHead>
              <TableHead className="text-[10px]">STATUS</TableHead>
              <TableHead className="text-[10px] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-4">
                  <Skeleton className="h-10 w-full" />
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => {
                const pdfUrl = appt.assessments?.[0]?.pdfUrl;

                return (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium text-xs">
                      <Link
                        href={`/admin/customers/${appt.customer.id}`}
                        className="font-bold text-foreground hover:text-[#E8621A]"
                      >
                        {appt.customer.name}
                      </Link>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6 bg-orange-100 text-[#E8621A] font-bold text-[10px]">
                          <AvatarImage src={appt.salesperson.avatar} />
                          <AvatarFallback>{appt.salesperson.name[0]}</AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/admin/salespersons/${appt.salesperson.id}`}
                          className="hover:text-[#E8621A]"
                        >
                          {appt.salesperson.name}
                        </Link>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Calendar className="size-3.5 text-[#E8621A]" />
                        <span>{format(new Date(appt.date), "dd MMM yyyy")}</span>
                        <span className="text-muted-foreground font-normal">· {appt.time}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          appt.status === "COMPLETED"
                            ? "success"
                            : appt.status === "CANCELLED"
                              ? "destructive"
                              : "brand"
                        }
                        className="text-[10px]"
                      >
                        {/* {appt.status === "COMPLETED" && <CheckCircle2 data-icon="inline-start" />}
                        {appt.status === "SCHEDULED" && <Clock data-icon="inline-start" />}
                        {appt.status === "CANCELLED" && <XCircle data-icon="inline-start" />} */}
                        {appt.status}
                      </Badge>
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => setRescheduleAppointment(appt)}
                            className="text-xs cursor-pointer"
                          >
                            <CalendarClock className="mr-2 size-4 text-[#E8621A]" />
                            Reschedule Date
                          </DropdownMenuItem>

                          {pdfUrl ? (
                            <DropdownMenuItem asChild className="text-xs cursor-pointer">
                              <a href={pdfUrl} download>
                                <Download className="mr-2 size-4 text-emerald-600" />
                                Download PDF
                              </a>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem disabled className="text-xs opacity-50">
                              <FileText className="mr-2 size-4" />
                              PDF Not Ready
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            disabled={appt.status === "CANCELLED"}
                            onClick={() => cancelMutation.mutate(appt.id)}
                            className="text-xs text-rose-600 cursor-pointer focus:bg-rose-50 focus:text-rose-700"
                          >
                            <Ban className="mr-2 size-4 text-rose-600" />
                            Cancel Appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
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

      <CreateAppointmentModal
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onSuccess={() => refetch()}
      />

      <RescheduleAppointmentModal
        appointment={rescheduleAppointment}
        isOpen={!!rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
