import Link from "next/link";
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";
import { db } from "@/lib/db";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AdminAssessmentsPage() {
  const assessments = await db.assessment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      salesperson: true,
      appointment: true,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Assessments</h1>
          <p className="text-xs text-muted-foreground">All bathroom renovation reports and PDF documents.</p>
        </div>
      </div>

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
            {assessments.length === 0 ? (
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
      </div>
    </div>
  );
}
