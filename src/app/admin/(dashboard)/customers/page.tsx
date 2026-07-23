"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";

import { NewCustomerModal } from "@/components/modals/new-customer-modal";
import { DataPagination } from "@/components/admin/data-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  assessments?: { id: string; createdAt: string; status: string }[];
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-customers", search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/customers?${params}`);
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
  });

  const customers: Customer[] = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-xs text-muted-foreground">Manage client list and assessment history.</p>
        </div>
        <Button
          onClick={() => setIsNewSheetOpen(true)}
          className="bg-[#E8621A] hover:bg-orange-600 text-white font-semibold text-xs"
        >
          <Plus data-icon="inline-start" /> Add Customer
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
          placeholder="Search by name, phone, or address..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-[10px]">CUSTOMER</TableHead>
              <TableHead className="text-[10px]">PHONE</TableHead>
              <TableHead className="text-[10px]">ADDRESS</TableHead>
              <TableHead className="text-[10px]">LAST ASSESSMENT</TableHead>
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
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-xs">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 bg-orange-100 text-[#E8621A] font-bold text-xs">
                        <AvatarFallback>{c.name[0]}</AvatarFallback>
                      </Avatar>
                      <Link href={`/admin/customers/${c.id}`} className="font-bold text-foreground hover:text-[#E8621A]">
                        {c.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.phone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.address || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.assessments?.[0]
                      ? format(new Date(c.assessments[0].createdAt), "dd MMM yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell className="font-bold text-xs">{c.assessments?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-[#E8621A]"
                    >
                      <Link href={`/admin/customers/${c.id}`}>
                        <Eye className="size-4" />
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

      <NewCustomerModal
        isOpen={isNewSheetOpen}
        onClose={() => setIsNewSheetOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
