"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export type EntityType = "customer" | "salesperson" | "appointment" | "assessment";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityType: EntityType;
  entityName?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  entityName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const getWarningText = () => {
    switch (entityType) {
      case "customer":
        return "This will permanently delete the customer and all their related data.";
      case "salesperson":
        return "This will permanently delete the salesperson and all their related data.";
      case "appointment":
        return "This will permanently delete the appointment and all its related data.";
      case "assessment":
        return "This will permanently delete the assessment and all its related data.";
      default:
        return "This action cannot be undone.";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {entityType} {entityName ? `"${entityName}"` : ""}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-rose-600 font-medium">
            {getWarningText()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isDeleting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
