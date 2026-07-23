"use client";

import { useState } from "react";
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
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewCustomerModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create customer");
      } else {
        toast.success("Customer created!");
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
        queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
        queryClient.invalidateQueries({ queryKey: ["customers"] });
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
            <SheetTitle>New Customer</SheetTitle>
            <SheetDescription>
              Enter client contact details to register a new bathroom renovation customer.
            </SheetDescription>
          </SheetHeader>

          <form id="new-customer-form" onSubmit={handleSubmit} className="py-6">
            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="cust-name">Full Name</FieldLabel>
                <Input
                  id="cust-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Damon"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cust-email">Email</FieldLabel>
                <Input
                  id="cust-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="damon@gmail.com"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cust-phone">Phone Number</FieldLabel>
                <Input
                  id="cust-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0142835945"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="cust-address">Address</FieldLabel>
                <Input
                  id="cust-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="14 Harbour View, Auckland"
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
            form="new-customer-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Saving..." : "Save Customer"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
