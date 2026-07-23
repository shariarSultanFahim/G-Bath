import Link from "next/link";
import { format } from "date-fns";
import { Eye, CalendarDays, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { db } from "@/lib/db";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
  const appointments = await db.appointment.findMany({
    orderBy: { date: "asc" },
    include: {
      customer: true,
      salesperson: true,
      assessments: true,
    },
  });

  const assessments = await db.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: true,
    },
  });

  const scheduledCount = appointments.filter((a) => a.status === "SCHEDULED").length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const pdfReadyCount = assessments.filter((a) => a.pdfUrl !== null).length;
  const newAssessmentsCount = assessments.filter((a) => a.status === "SUBMITTED").length;

  return (
    <div className="flex flex-col gap-8">
      {/* Date Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#E8621A]">
          {format(new Date(), "EEEE, dd MMMM yyyy")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome to Good Bathroom Renos administrative overview.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-orange-200 bg-orange-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Scheduled</CardTitle>
            <CalendarDays className="size-4 text-[#E8621A]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Upcoming site visits</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Completed</CardTitle>
            <CheckCircle2 className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Assessed appointments</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">PDF Ready</CardTitle>
            <FileText className="size-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pdfReadyCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Generated reports</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground">New Assessments</CardTitle>
            <Sparkles className="size-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{newAssessmentsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Today's Appointments</h2>
          <p className="text-xs text-muted-foreground">{appointments.length} appointments scheduled</p>
        </div>

        <div className="flex flex-col gap-3">
          {appointments.length === 0 ? (
            <Card className="p-8 text-center text-xs text-muted-foreground">
              No appointments scheduled for today.
            </Card>
          ) : (
            appointments.map((appt) => (
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
                        <Avatar className="size-4 bg-muted text-[9px] font-bold">
                          <AvatarFallback>{appt.salesperson.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{appt.salesperson.name}</span>
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

      {/* New Assessments */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">New Assessments</h2>
            <p className="text-xs text-muted-foreground">Submitted by salespersons for review</p>
          </div>
          <Button asChild variant="link" size="sm" className="text-xs text-[#E8621A]">
            <Link href="/admin/assessments">View all ›</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assessments.length === 0 ? (
            <p className="col-span-3 text-xs text-muted-foreground italic">No assessments submitted yet.</p>
          ) : (
            assessments.slice(0, 3).map((ass) => (
              <Card key={ass.id} className="flex flex-col justify-between p-5 border-2 border-primary/20">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 bg-muted text-xs font-bold">
                        <AvatarFallback>{ass.salesperson.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-foreground text-sm">{ass.customer.name}</h4>
                        <span className="text-xs text-muted-foreground">{ass.salesperson.name}</span>
                      </div>
                    </div>
                    <Badge variant="success">PDF Ready</Badge>
                  </div>
                </div>

                <Button asChild variant="outline" size="sm" className="mt-4 w-full text-xs text-[#E8621A] border-orange-200 hover:bg-orange-50">
                  <Link href={`/admin/assessments/${ass.id}`}>
                    <Eye data-icon="inline-start" /> View Assessment
                  </Link>
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
