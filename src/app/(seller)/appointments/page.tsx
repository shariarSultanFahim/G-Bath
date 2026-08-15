"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, Plus, Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { AppointmentModal } from "@/components/admin/appointment-modal";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentItem {
  id: string;
  date: string;
  time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    address?: string;
  };
  assessments?: { id: string; status?: string; pdfUrl?: string }[];
}

export default function SellerAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["seller-appointments", search],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: "100",
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/appointments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  const appointments: AppointmentItem[] = data?.data || [];

  return (
    <div className="space-y-5 pb-6">
      {/* Search + New Appointment Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search appointments or customers..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:border-[#E8621A] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 rounded-2xl bg-[#E8621A] px-4 py-2.5 text-sm font-semibold text-white shadow-md active:scale-95 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Appointments</h2>
        <span className="text-xs font-medium text-slate-400">
          {isLoading ? "Loading..." : `${appointments.length} total`}
        </span>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">
              {search ? "No appointments matching your search." : "No appointments scheduled."}
            </p>
            {!search && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#E8621A] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Schedule your first appointment
              </button>
            )}
          </div>
        ) : (
          appointments.map((appt) => {
            const isAssessed = (appt.assessments?.length || 0) > 0;
            return (
              <Link
                key={appt.id}
                href={`/appointments/${appt.id}`}
                className="block rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition hover:shadow-md active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 truncate">{appt.customer.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" /> {appt.time}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" /> {format(new Date(appt.date), "dd MMM yyyy")}
                      </span>
                    </p>
                    {appt.notes && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        {appt.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        appt.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-600"
                          : appt.status === "CANCELLED"
                          ? "bg-rose-50 text-rose-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {appt.status ? appt.status.charAt(0) + appt.status.slice(1).toLowerCase() : "Scheduled"}
                    </span>
                    {isAssessed && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                        Assessed
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
        hideSalespersonSelect={true}
      />
    </div>
  );
}
