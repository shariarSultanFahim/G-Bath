"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAppointmentModal({ isOpen, onClose, onSuccess }: Props) {
  const [customerId, setCustomerId] = useState("");
  const [salespersonId, setSalespersonId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch Customers for Searchable Combobox
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ["admin-customers-all"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
    enabled: isOpen,
  });

  // Fetch Salespersons for Searchable Combobox
  const { data: salespersons = [], isLoading: loadingSalespersons } = useQuery({
    queryKey: ["admin-salespersons-all"],
    queryFn: async () => {
      const res = await fetch("/api/admin/salespersons");
      if (!res.ok) throw new Error("Failed to fetch salespersons");
      return res.json();
    },
    enabled: isOpen,
  });

  const customerOptions = (customers as Array<{ id: string; name: string; phone: string; address?: string }>).map((c) => ({
    id: c.id,
    label: c.name,
    sublabel: `${c.phone}${c.address ? ` · ${c.address}` : ""}`,
  }));

  const salespersonOptions = (salespersons as Array<{ id: string; name: string; email: string; status: string }>)
    .filter((s) => s.status === "ACTIVE")
    .map((s) => ({
      id: s.id,
      label: s.name,
      sublabel: s.email,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!salespersonId) {
      toast.error("Please select a salesperson");
      return;
    }
    if (!date) {
      toast.error("Please select an appointment date");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          salespersonId,
          date,
          time,
          notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create appointment");
      } else {
        toast.success("Appointment scheduled successfully!");
        setCustomerId("");
        setSalespersonId("");
        setDate("");
        setNotes("");
        queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        onClose();
        onSuccess?.();
      }
    } catch {
      toast.error("An error occurred while creating appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle>Schedule New Appointment</SheetTitle>
            <SheetDescription>
              Assign a salesperson to visit a client for a bathroom assessment.
            </SheetDescription>
          </SheetHeader>

          <form id="create-appointment-form" onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
            <FieldGroup className="flex flex-col gap-4">
              {/* Searchable Customer Combobox */}
              <Field>
                <FieldLabel>Customer</FieldLabel>
                <SearchableSelect
                  options={customerOptions}
                  value={customerId}
                  onChange={setCustomerId}
                  placeholder="Select customer..."
                  searchPlaceholder="Type customer name or phone..."
                  loading={loadingCustomers}
                />
              </Field>

              {/* Searchable Salesperson Combobox */}
              <Field>
                <FieldLabel>Salesperson</FieldLabel>
                <SearchableSelect
                  options={salespersonOptions}
                  value={salespersonId}
                  onChange={setSalespersonId}
                  placeholder="Select salesperson..."
                  searchPlaceholder="Type seller name or email..."
                  loading={loadingSalespersons}
                />
              </Field>

              {/* Date */}
              <Field>
                <FieldLabel htmlFor="appt-date">Appointment Date</FieldLabel>
                <Input
                  id="appt-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>

              {/* Time */}
              <Field>
                <FieldLabel htmlFor="appt-time">Appointment Time</FieldLabel>
                <Input
                  id="appt-time"
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                />
              </Field>

              {/* Notes */}
              <Field>
                <FieldLabel htmlFor="appt-notes">Notes (Optional)</FieldLabel>
                <Input
                  id="appt-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Full master bathroom renovation"
                />
              </Field>
            </FieldGroup>
          </form>
        </div>

        <SheetFooter className="pt-4 border-t border-border flex gap-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-appointment-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Scheduling..." : "Schedule Appointment"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
