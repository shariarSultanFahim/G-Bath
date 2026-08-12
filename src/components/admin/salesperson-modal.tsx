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

export interface SalespersonData {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: SalespersonData | null;
}

export function SalespersonModal({ isOpen, onClose, onSuccess, initialData }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("seller123");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setPhone(initialData.phone || "");
      setPassword(""); // Password isn't updated here usually, unless specified
    } else if (isOpen && !initialData) {
      setName("");
      setEmail("");
      setPhone("");
      setPassword("seller123");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing ? `/api/admin/salespersons/${initialData.id}` : "/api/admin/salespersons";
      const method = isEditing ? "PATCH" : "POST";

      const bodyData: any = { name, email, phone };
      if (!isEditing) {
        bodyData.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || `Failed to ${isEditing ? "update" : "create"} salesperson`);
      } else {
        toast.success(`Salesperson account ${isEditing ? "updated" : "created"}!`);
        queryClient.invalidateQueries({ queryKey: ["admin-salespersons"] });
        queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        if (isEditing && initialData?.id) {
          queryClient.invalidateQueries({ queryKey: ["admin-salespersons", initialData.id] });
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
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col justify-between">
        <div>
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle>{isEditing ? "Edit Salesperson" : "Create Salesperson"}</SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update salesperson account details."
                : "Add a new salesperson account to access the mobile web app."}
            </SheetDescription>
          </SheetHeader>

          <form id="salesperson-form" onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="sp-name">Full Name</FieldLabel>
                <Input
                  id="sp-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="sp-email">Email Address</FieldLabel>
                <Input
                  id="sp-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@gbath.com"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="sp-phone">Phone Number</FieldLabel>
                <Input
                  id="sp-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="021 555 0100"
                />
              </Field>

              {!isEditing && (
                <Field>
                  <FieldLabel htmlFor="sp-pass">Initial Password</FieldLabel>
                  <Input
                    id="sp-pass"
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
              )}
            </FieldGroup>

            {!isEditing && (
              <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground italic">
                The salesperson will log in using this email address and password.
              </p>
            )}
          </form>
        </div>

        <SheetFooter className="pt-4 border-t border-border flex gap-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="salesperson-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Saving..." : (isEditing ? "Save Changes" : "Create Account")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
