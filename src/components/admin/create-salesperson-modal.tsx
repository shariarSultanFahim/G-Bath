"use client";

import { useState } from "react";
import { toast } from "sonner";

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
  onSuccess: () => void;
}

export function CreateSalespersonModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("seller123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/salespersons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create salesperson");
      } else {
        toast.success("Salesperson account created!");
        setName("");
        setEmail("");
        setPhone("");
        onClose();
        onSuccess();
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
            <SheetTitle>Create Salesperson</SheetTitle>
            <SheetDescription>
              Add a new salesperson account to access the mobile web app.
            </SheetDescription>
          </SheetHeader>

          <form id="create-salesperson-form" onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
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
            </FieldGroup>

            <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground italic">
              The salesperson will log in using this email address and password.
            </p>
          </form>
        </div>

        <SheetFooter className="pt-4 border-t border-border flex gap-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-salesperson-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
