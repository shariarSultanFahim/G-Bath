"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { CustomerModal, CustomerData } from "@/components/modals/customer-modal";
import { useRouter } from "next/navigation";

export function CustomerActions({ customer }: { customer: CustomerData }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button 
        onClick={() => setIsEditOpen(true)}
        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-[#E8621A] transition-colors hover:bg-orange-200"
      >
        <Edit className="h-3.5 w-3.5" />
        Edit Customer
      </button>

      <CustomerModal
        initialData={customer}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
