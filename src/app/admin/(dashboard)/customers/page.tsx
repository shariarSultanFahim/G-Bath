"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Eye } from "lucide-react";
import { CustomerDetailModal } from "@/components/admin/customer-detail-modal";
import { NewCustomerModal } from "@/components/modals/new-customer-modal";
import { format } from "date-fns";

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
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-[#E8621A] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or address..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-[#E8621A] focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-4">CUSTOMER</th>
              <th className="p-4">PHONE</th>
              <th className="p-4">ADDRESS</th>
              <th className="p-4">LAST ASSESSMENT</th>
              <th className="p-4">ASSESSMENTS</th>
              <th className="p-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-[#E8621A]">
                      {c.name[0]}
                    </div>
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{c.phone}</td>
                  <td className="p-4 text-slate-600">{c.address || "—"}</td>
                  <td className="p-4 text-slate-500">
                    {c.assessments?.[0]
                      ? format(new Date(c.assessments[0].createdAt), "dd MMM yyyy")
                      : "—"}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{c.assessments?.length || 0}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="p-1.5 text-slate-400 hover:text-[#E8621A]"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      <NewCustomerModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}
