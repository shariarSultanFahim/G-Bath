"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Eye, CalendarDays, CheckCircle2, FileText, Sparkles, RefreshCw, Pen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface SalespersonInfo {
  id: string;
  name: string;
  avatar?: string;
}

interface AppointmentItem {
  id: string;
  customerId: string;
  salespersonId: string;
  date: string;
  time: string;
  status: string;
  customer: CustomerInfo;
  salesperson: SalespersonInfo;
}

interface AssessmentItem {
  id: string;
  customerId: string;
  salespersonId: string;
  status: string;
  pdfUrl?: string | null;
  createdAt: string;
  customer: CustomerInfo;
  salesperson: SalespersonInfo;
}

export default function AdminDashboardPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
  });

  const stats = data?.stats || {
    scheduledCount: 0,
    completedCount: 0,
    pdfReadyCount: 0,
    newAssessmentsCount: 0,
  };
  const appointments: AppointmentItem[] = data?.appointments || [];
  const assessments: AssessmentItem[] = (data?.assessments || []).slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#E8621A]">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome to Good Bathroom Renos administrative overview.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs text-muted-foreground"
        >
          <RefreshCw data-icon="inline-start" className={isFetching ? "animate-spin" : ""} />
          Refetch Data
        </Button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-orange-200 bg-orange-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Scheduled</CardTitle>
            <CalendarDays className="size-4 text-[#E8621A]" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.scheduledCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Upcoming site visits</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Completed</CardTitle>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.completedCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Assessed appointments</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">PDF Ready</CardTitle>
            <FileText className="size-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.pdfReadyCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Generated reports</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">New Assessments</CardTitle>
            <Pen className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold text-foreground">{stats.newAssessmentsCount}</div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Side-by-Side View: Today's Appointments & New Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Today's Appointments */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Today's Appointments</h2>
            <p className="text-xs text-muted-foreground">{appointments.length} appointments scheduled</p>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : appointments.length === 0 ? (
              <Card className="p-8 text-center text-xs text-muted-foreground">
                No appointments scheduled for today.
              </Card>
            ) : (
              appointments.map((appt: AppointmentItem) => (
                <Card key={appt.id} className="p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center rounded-xl bg-orange-100/70 size-14 shrink-0">
                        <span className="text-base font-extrabold text-[#E8621A]">
                          {appt.time.split(" ")[0]}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-orange-600">
                          {appt.time.split(" ")[1] || "AM"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <h3 className="font-bold text-foreground text-sm">{appt.customer.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Avatar className="size-5 bg-orange-100 text-[#E8621A] font-bold text-[10px]">
                            {appt.salesperson?.avatar && (
                              <AvatarImage src={appt.salesperson.avatar} alt={appt.salesperson.name} />
                            )}
                            <AvatarFallback>{appt.salesperson?.name?.[0] || "S"}</AvatarFallback>
                          </Avatar>
                          <span>{appt.salesperson?.name}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="brand">{appt.status}</Badge>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column: New Assessments (Latest 3) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">New Assessments</h2>
              <p className="text-xs text-muted-foreground">Latest 3 submitted reports</p>
            </div>
            <Button asChild variant="link" size="sm" className="text-xs text-[#E8621A]">
              <Link href="/admin/assessments">View all ›</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : assessments.length === 0 ? (
              <Card className="p-8 text-center text-xs text-muted-foreground">
                No recent assessments.
              </Card>
            ) : (
              assessments.map((ass: AssessmentItem) => (
                <Card
                  key={ass.id}
                  className="p-4 shadow-sm hover:shadow-md transition-all border border-border/80 bg-card flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-orange-50 text-[#E8621A] shrink-0 border border-orange-100">
                        <FileText className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-foreground text-sm leading-tight">
                          {ass.customer?.name || "Client Assessment"}
                        </h4>
                        <span className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          #{ass.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <Badge variant={ass.pdfUrl ? "success" : "brand"} className="text-[10px] shrink-0">
                      {ass.pdfUrl ? "PDF Ready" : ass.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5 bg-orange-100 text-[#E8621A] font-bold text-[9px]">
                        {ass.salesperson?.avatar && (
                          <AvatarImage src={ass.salesperson.avatar} alt={ass.salesperson.name} />
                        )}
                        <AvatarFallback>{ass.salesperson?.name?.[0] || "S"}</AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground text-[11px]">
                        By <strong className="text-foreground font-semibold">{ass.salesperson?.name}</strong>
                      </span>
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2.5 text-xs text-[#E8621A] hover:text-orange-700 hover:bg-orange-50 font-semibold"
                    >
                      <Link href={`/admin/assessments/${ass.id}`}>
                        <Eye data-icon="inline-start" className="size-3.5" /> View Report
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
