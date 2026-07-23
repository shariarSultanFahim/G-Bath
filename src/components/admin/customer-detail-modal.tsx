"use client";

import { X, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface AssessmentItem {
  id: string;
  createdAt: string;
  salesperson: { name: string };
  status: string;
  pdfUrl?: string;
}

interface CustomerModalProps {
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

export function CustomerDetailModal({ customer, isOpen, onClose }: CustomerModalProps) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-orange-500 border-t-2 pt-2 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-2xl font-extrabold text-[#E8621A]">
              {customer.name[0]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{customer.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3.5 w-3.5" /> Customer since{" "}
                {format(new Date(customer.createdAt), "d MMM yyyy")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs text-slate-600 border-b border-orange-200/50 pb-6">
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">PHONE</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{customer.phone}</span>
          </div>
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">EMAIL</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{customer.email || "N/A"}</span>
          </div>
          <div>
            <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">ADDRESS</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{customer.address || "N/A"}</span>
          </div>
        </div>

        {/* Assessment History */}
        <div className="space-y-3">
          <div className="rounded-xl bg-orange-50 p-3 text-sm font-bold text-[#E8621A]">
            Assessment History ({customer.assessments?.length || 0})
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase">
                <th className="py-2">ASSESSMENT DATE</th>
                <th className="py-2">SALESPERSON</th>
                <th className="py-2">STATUS</th>
                <th className="py-2">RESOURCES</th>
                <th className="py-2 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {!customer.assessments || customer.assessments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-400">
                    No assessments recorded.
                  </td>
                </tr>
              ) : (
                customer.assessments.map((ass) => (
                  <tr key={ass.id} className="border-b border-slate-50">
                    <td className="py-3 font-semibold text-slate-700">
                      {format(new Date(ass.createdAt), "dd MMM yyyy")}
                    </td>
                    <td className="py-3 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600">
                        {ass.salesperson.name[0]}
                      </span>
                      {ass.salesperson.name}
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        {ass.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {ass.pdfUrl ? (
                        <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600">
                          PDF
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/assessments/${ass.id}`}
                        className="inline-flex items-center gap-1 font-bold text-[#E8621A] hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Assessment
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
