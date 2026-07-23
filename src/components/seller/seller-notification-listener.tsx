"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function SellerNotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data);

        // Show instant top-center toast for Seller
        toast.info(notif.title, {
          description: notif.message,
          position: "top-center",
        });

        // Invalidate appointments query to update live list
        queryClient.invalidateQueries({ queryKey: ["seller-appointments"] });
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

  return null;
}
