"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { NewCustomerModal } from "@/components/modals/new-customer-modal";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function SellerCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#E8621A]">Good</h1>
        <span className="text-xs text-slate-400 font-medium">{format(new Date(), "hh:mm a")}</span>
      </div>

      {/* Search + New button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 rounded-2xl bg-[#E8621A] px-4 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {/* Customers List */}
      <div className="space-y-3">
        {customers.length === 0 ? (
          <p className="text-center text-xs text-slate-400 py-8">No customers found.</p>
        ) : (
          customers.map((c) => (
            <Link
              key={c.id}
              href={`/customers/${c.id}`}
              className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-[#E8621A]">
                  {c.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">📞 {c.phone}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>
          ))
        )}
      </div>

      <NewCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}
