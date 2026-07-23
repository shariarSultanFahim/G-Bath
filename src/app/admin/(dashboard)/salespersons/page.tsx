"use client";

import { useEffect, useState } from "react";
import { Search, Plus, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { CreateSalespersonModal } from "@/components/admin/create-salesperson-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED";
  assessments?: any[];
}

export default function AdminSalespersonsPage() {
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [search, setSearch] = useState("");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const fetchSalespersons = async () => {
    try {
      const res = await fetch("/api/admin/salespersons");
      if (res.ok) {
        const data = await res.json();
        setSalespersons(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSalespersons();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/salespersons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Salesperson ${newStatus.toLowerCase()}`);
        fetchSalespersons();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filtered = salespersons.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email..."
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
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                  No salespersons found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-xs">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 bg-orange-100 text-[#E8621A] font-bold text-xs">
                        <AvatarFallback>{s.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-foreground">{s.name}</span>
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(s.id, s.status)}
                      title={s.status === "ACTIVE" ? "Suspend" : "Activate"}
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
      </div>

      <CreateSalespersonModal
        isOpen={isCreateSheetOpen}
        onClose={() => setIsCreateSheetOpen(false)}
        onSuccess={fetchSalespersons}
      />
    </div>
  );
}
