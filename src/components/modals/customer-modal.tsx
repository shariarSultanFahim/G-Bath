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

export interface CustomerData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: CustomerData | null;
}

export function CustomerModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setAddress(initialData.address || "");
    } else if (isOpen && !initialData) {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/customers/${initialData.id}` : "/api/customers";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || `Failed to ${isEditing ? "update" : "create"} customer`);
      } else {
        toast.success(`Customer ${isEditing ? "updated" : "created"}!`);
        queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        if (isEditing && initialData?.id) {
          queryClient.invalidateQueries({ queryKey: ["customer", initialData.id] });
          queryClient.invalidateQueries({ queryKey: ["admin-customer", initialData.id] });
        }
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
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col max-h-screen">
        <SheetHeader className="pb-4 border-b border-border shrink-0">
          <SheetTitle>{isEditing ? "Edit Customer" : "New Customer"}</SheetTitle>
          <SheetDescription>
            {isEditing 
              ? "Update the details for this customer." 
              : "Enter client contact details to register a new bathroom renovation customer."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <form id="customer-form" onSubmit={handleSubmit} className="py-6">
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

        <SheetFooter className="pt-4 border-t border-border flex gap-2 shrink-0">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="customer-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Saving..." : (isEditing ? "Save Changes" : "Save Customer")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
