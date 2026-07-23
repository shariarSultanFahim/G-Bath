"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import { format } from "date-fns";

import { CustomerDetailModal } from "@/components/admin/customer-detail-modal";
import { NewCustomerModal } from "@/components/modals/new-customer-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  assessments?: any[];
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewSheetOpen, setIsNewSheetOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

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
          onChange={(e) => setSearch(e.target.value)}
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
            {customers.length === 0 ? (
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
                      <span className="font-bold text-foreground">{c.name}</span>
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
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCustomer(c)}
                      className="size-8 text-muted-foreground hover:text-[#E8621A]"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      <NewCustomerModal
        isOpen={isNewSheetOpen}
        onClose={() => setIsNewSheetOpen(false)}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}
