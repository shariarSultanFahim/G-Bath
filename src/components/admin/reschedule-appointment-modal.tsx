"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

interface Props {
  appointment: {
    id: string;
    date: string;
    time: string;
    customer: { name: string };
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RescheduleAppointmentModal({ appointment, isOpen, onClose, onSuccess }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (appointment) {
      setDate(appointment.date ? appointment.date.split("T")[0] : "");
      setTime(appointment.time || "10:00 AM");
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please pick a new date");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          status: "SCHEDULED",
        }),
      });

      if (!res.ok) {
        toast.error("Failed to reschedule appointment");
      } else {
        toast.success("Appointment rescheduled!");
        queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        onClose();
        onSuccess?.();
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle>Reschedule Appointment</SheetTitle>
            <SheetDescription>
              Change the date and time for {appointment.customer.name}'s appointment.
            </SheetDescription>
          </SheetHeader>

          <form id="reschedule-form" onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="res-date">New Date</FieldLabel>
                <Input
                  id="res-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="res-time">New Time</FieldLabel>
                <Input
                  id="res-time"
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 02:00 PM"
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
            form="reschedule-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Updating..." : "Save New Date"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
