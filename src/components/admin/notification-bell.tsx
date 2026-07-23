"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, FileText, Calendar, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Connect to SSE real-time notification stream
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      try {
        const notif: NotificationItem = JSON.parse(event.data);
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show instant top-center toast
        toast.info(notif.title, {
          description: notif.message,
          position: "top-center",
        });
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleMarkAsRead = async (id: string, link?: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }

    if (link) {
      setOpen(false);
      router.push(link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read", { position: "top-center" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative size-9 text-muted-foreground hover:text-foreground">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-[#E8621A] text-[9px] font-extrabold text-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-orange-100 text-[#E8621A] px-2 py-0.5 text-[10px] font-extrabold">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="h-6 text-[10px] text-[#E8621A] hover:bg-orange-50"
            >
              <CheckCheck className="mr-1 size-3" /> Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleMarkAsRead(n.id, n.link)}
                className={`p-3 text-xs flex gap-3 cursor-pointer transition-colors hover:bg-orange-50/60 ${
                  !n.read ? "bg-orange-50/30" : "opacity-80"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {n.type === "NEW_ASSESSMENT" ? (
                    <div className="flex size-7 items-center justify-center rounded-full bg-orange-100 text-[#E8621A]">
                      <FileText className="size-3.5" />
                    </div>
                  ) : n.type === "NEW_APPOINTMENT" ? (
                    <div className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Calendar className="size-3.5" />
                    </div>
                  ) : (
                    <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <Info className="size-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-bold truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {n.title}
                    </span>
                    <span className="text-[9px] text-muted-foreground shrink-0">
                      {format(new Date(n.createdAt), "hh:mm a")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px] line-clamp-2 leading-tight">
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
