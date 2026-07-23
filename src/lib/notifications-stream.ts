import { EventEmitter } from "events";

class NotificationEmitter extends EventEmitter {}

export const notificationEmitter = (globalThis as any).notificationEmitter || new NotificationEmitter();

if (process.env.NODE_ENV !== "production") {
  (globalThis as any).notificationEmitter = notificationEmitter;
}
