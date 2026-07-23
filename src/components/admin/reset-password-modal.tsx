"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff } from "lucide-react";

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
  salesperson: {
    id: string;
    name: string;
    email: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResetPasswordModal({ salesperson, isOpen, onClose }: Props) {
  const [newPassword, setNewPassword] = useState("seller123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (salesperson) {
      setNewPassword("seller123");
    }
  }, [salesperson]);

  if (!salesperson) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/salespersons/${salesperson.id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to reset password");
      } else {
        toast.success(`Password reset successfully for ${salesperson.name}!`, {
          position: "top-center",
        });
        onClose();
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
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-[#E8621A]" />
              <SheetTitle>Reset Password</SheetTitle>
            </div>
            <SheetDescription>
              Set a new login password for {salesperson.name} ({salesperson.email}).
            </SheetDescription>
          </SheetHeader>

          <form id="reset-password-form" onSubmit={handleSubmit} className="py-6 flex flex-col gap-4">
            <FieldGroup className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="new-pass">New Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="new-pass"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            <p className="rounded-xl bg-orange-50 p-3 text-xs text-orange-800 border border-orange-200">
              The salesperson can immediately log into the mobile app using this new password.
            </p>
          </form>
        </div>

        <SheetFooter className="pt-4 border-t border-border flex gap-2">
          <Button variant="outline" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form="reset-password-form"
            disabled={loading}
            className="flex-1 bg-[#E8621A] hover:bg-orange-600 text-white font-semibold"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
