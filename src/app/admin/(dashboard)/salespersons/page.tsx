"use client";

import { useEffect, useState } from "react";
import { Search, Plus, UserX, UserCheck } from "lucide-react";
import { CreateSalespersonModal } from "@/components/admin/create-salesperson-modal";
import { toast } from "sonner";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Salespersons</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#E8621A] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Create Salesperson
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-[#E8621A] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">NAME</th>
              <th className="p-4">EMAIL</th>
              <th className="p-4">PHONE</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">TOTAL ASSESSMENTS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No salespersons found.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-[#E8621A]">
                      {s.name[0]}
                    </div>
                    <span className="font-bold text-slate-900">{s.name}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{s.email}</td>
                  <td className="p-4 text-slate-600">{s.phone || "—"}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{s.assessments?.length || 0}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleStatus(s.id, s.status)}
                      title={s.status === "ACTIVE" ? "Suspend" : "Activate"}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      {s.status === "ACTIVE" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateSalespersonModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchSalespersons}
      />
    </div>
  );
}
