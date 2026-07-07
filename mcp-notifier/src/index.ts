import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logPath = join(__dirname, "../notifications.json");

interface Notification {
  id: string;
  type: "channel" | "direct_message";
  target: string;
  message: string;
  sent_at: string;
  metadata?: Record<string, string>;
}

function loadLog(): Notification[] {
  if (!existsSync(logPath)) return [];
  return JSON.parse(readFileSync(logPath, "utf-8"));
}

function saveLog(notifications: Notification[]): void {
  writeFileSync(logPath, JSON.stringify(notifications, null, 2));
}

const server = new McpServer({
  name: "platform-notifier",
  version: "1.0.0",
});

server.tool(
  "notify_channel",
  "Post a notification to a Slack channel (e.g. #platform-support, #team-payments)",
  {
    channel: z.string().describe("Channel name (e.g. '#platform-support', '#team-payments')"),
    message: z.string().describe("Message to post"),
    metadata: z.record(z.string(), z.string()).optional().describe("Optional metadata (e.g. {\"service\": \"s3\", \"team\": \"payments\"})"),
  },
  async ({ channel, message, metadata }) => {
    const notifications = loadLog();

    const notification: Notification = {
      id: randomUUID(),
      type: "channel",
      target: channel,
      message,
      sent_at: new Date().toISOString(),
      metadata,
    };

    notifications.push(notification);
    saveLog(notifications);

    return {
      content: [{
        type: "text" as const,
        text: [
          `Notification sent to ${channel}`,
          ``,
          `Message: ${message}`,
          `ID: ${notification.id}`,
          `Sent at: ${notification.sent_at}`,
        ].join("\n"),
      }],
    };
  }
);

server.tool(
  "notify_user",
  "Send a direct message to a user (e.g. notify a developer their resource is ready)",
  {
    user: z.string().describe("Username or email of the recipient"),
    message: z.string().describe("Message to send"),
    metadata: z.record(z.string(), z.string()).optional().describe("Optional metadata"),
  },
  async ({ user, message, metadata }) => {
    const notifications = loadLog();

    const notification: Notification = {
      id: randomUUID(),
      type: "direct_message",
      target: user,
      message,
      sent_at: new Date().toISOString(),
      metadata,
    };

    notifications.push(notification);
    saveLog(notifications);

    return {
      content: [{
        type: "text" as const,
        text: [
          `Direct message sent to ${user}`,
          ``,
          `Message: ${message}`,
          `ID: ${notification.id}`,
          `Sent at: ${notification.sent_at}`,
        ].join("\n"),
      }],
    };
  }
);

server.tool(
  "get_notification_log",
  "View recent notifications sent, optionally filtered by channel or user",
  {
    target: z.string().optional().describe("Filter by channel or username"),
    limit: z.number().optional().describe("Number of recent notifications to return (default 10)"),
  },
  async ({ target, limit }) => {
    let notifications = loadLog();

    if (target) {
      notifications = notifications.filter(n => n.target.includes(target));
    }

    const count = limit || 10;
    notifications = notifications.slice(-count);

    if (notifications.length === 0) {
      return {
        content: [{ type: "text" as const, text: `No notifications found${target ? ` for "${target}"` : ""}.` }],
      };
    }

    const lines = notifications.map(n =>
      `[${n.sent_at}] ${n.type === "channel" ? n.target : `DM → ${n.target}`}: ${n.message}`
    );

    return {
      content: [{ type: "text" as const, text: lines.join("\n") }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
