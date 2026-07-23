import { getCurrentUser } from "@/lib/auth-utils";
import { notificationEmitter } from "@/lib/notifications-stream";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let isClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        if (isClosed) return;
        const isTarget =
          (data.role === "ADMIN" && user.role === "ADMIN") ||
          (data.userId && data.userId === user.id);

        if (isTarget) {
          try {
            const payload = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(new TextEncoder().encode(payload));
          } catch {
            isClosed = true;
            cleanup();
          }
        }
      };

      const interval = setInterval(() => {
        if (isClosed) {
          cleanup();
          return;
        }
        try {
          controller.enqueue(new TextEncoder().encode(": ping\n\n"));
        } catch {
          isClosed = true;
          cleanup();
        }
      }, 15000);

      const cleanup = () => {
        isClosed = true;
        notificationEmitter.off("notification", sendEvent);
        clearInterval(interval);
      };

      notificationEmitter.on("notification", sendEvent);

      req.signal.addEventListener("abort", () => {
        cleanup();
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
