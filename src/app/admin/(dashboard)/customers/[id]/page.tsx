"use client";

import { use } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Phone, Mail, MapPin, Eye, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentItem {
  id: string;
  createdAt: string;
  salesperson: { name: string };
  status: string;
  pdfUrl?: string;
}

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["admin-customer", id],
    queryFn: async () => {
      const res = await fetch(`/api/customers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch customer details");
      return res.json();
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

  if (!customer) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground">Customer not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/customers">Back to Customers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="w-fit text-xs text-[#E8621A] p-0 hover:bg-transparent">
        <Link href="/admin/customers">
          <ArrowLeft data-icon="inline-start" /> Back to Customers
        </Link>
      </Button>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16 border-2 border-primary/20 bg-orange-50 text-[#E8621A] font-extrabold text-2xl">
              <AvatarFallback>{customer.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{customer.name}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3.5" /> Client since{" "}
                {format(new Date(customer.createdAt), "d MMMM yyyy")}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
              <Phone className="size-4 text-[#E8621A]" />
              <span className="font-semibold">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
              <Mail className="size-4 text-[#E8621A]" />
              <span className="font-semibold">{customer.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
              <MapPin className="size-4 text-[#E8621A]" />
              <span className="font-semibold">{customer.address || "No address"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment History Table */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-foreground">
          Assessment History ({customer.assessments?.length || 0})
        </h2>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-[10px]">ASSESSMENT ID</TableHead>
                <TableHead className="text-[10px]">DATE</TableHead>
                <TableHead className="text-[10px]">SALESPERSON</TableHead>
                <TableHead className="text-[10px]">STATUS</TableHead>
                <TableHead className="text-[10px]">PDF REPORT</TableHead>
                <TableHead className="text-[10px] text-right">ACTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!customer.assessments || customer.assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                    No assessments recorded for this customer.
                  </TableCell>
                </TableRow>
              ) : (
                customer.assessments.map((ass: AssessmentItem) => (
                  <TableRow key={ass.id}>
                    <TableCell className="font-mono font-bold text-xs text-muted-foreground">
                      #{ass.id.slice(-4).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      {format(new Date(ass.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-5 bg-orange-100 text-[10px] text-orange-600 font-bold">
                          <AvatarFallback>{ass.salesperson.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{ass.salesperson.name}</span>
                      </div>
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
                          <Eye data-icon="inline-start" /> View Details
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
    </div>
  );
}
