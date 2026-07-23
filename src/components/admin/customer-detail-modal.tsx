"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Eye } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AssessmentItem {
  id: string;
  createdAt: string;
  salesperson: { name: string };
  status: string;
  pdfUrl?: string;
}

interface CustomerSheetProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    createdAt: string;
    assessments?: AssessmentItem[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerSheetProps) {
  if (!customer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border-2 border-primary/20 bg-orange-50 text-[#E8621A] font-extrabold text-xl">
              <AvatarFallback>{customer.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 text-left">
              <SheetTitle className="text-xl font-bold">{customer.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="size-3.5" /> Customer since{" "}
                {format(new Date(customer.createdAt), "d MMM yyyy")}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 flex flex-col gap-6">
          {/* Customer Metadata Grid */}
          <div className="grid grid-cols-3 gap-4 rounded-xl bg-muted/40 p-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-muted-foreground uppercase text-[10px]">Phone</span>
              <span className="font-semibold text-foreground text-sm">{customer.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-muted-foreground uppercase text-[10px]">Email</span>
              <span className="font-semibold text-foreground text-sm truncate">{customer.email || "N/A"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-muted-foreground uppercase text-[10px]">Address</span>
              <span className="font-semibold text-foreground text-sm">{customer.address || "N/A"}</span>
            </div>
          </div>

          {/* Assessment History */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-foreground">
              Assessment History ({customer.assessments?.length || 0})
            </h4>

            <div className="rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="text-[10px]">DATE</TableHead>
                    <TableHead className="text-[10px]">SALESPERSON</TableHead>
                    <TableHead className="text-[10px]">STATUS</TableHead>
                    <TableHead className="text-[10px]">PDF</TableHead>
                    <TableHead className="text-[10px] text-right">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!customer.assessments || customer.assessments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-6">
                        No assessments recorded.
                      </TableCell>
                    </TableRow>
                  ) : (
                    customer.assessments.map((ass) => (
                      <TableRow key={ass.id}>
                        <TableCell className="font-medium text-xs">
                          {format(new Date(ass.createdAt), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
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
                              PDF
                            </Badge>
                          ) : (
                            "—"
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
        </div>

        <SheetFooter className="pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
