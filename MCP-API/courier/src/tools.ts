import type { Risk } from "./policy.js";

export type ToolRoute = {
  external: string;
  upstream: string;
  risk: Risk;
  purpose: string;
};

export const TOOL_ROUTES: readonly ToolRoute[] = [
  { external: "courier.message.list", upstream: "list_messages", risk: "READ", purpose: "List delivery records for diagnostics and support workflows." },
  { external: "courier.message.get", upstream: "get_message", risk: "READ", purpose: "Read one Courier message and its delivery status." },
  { external: "courier.message.content.get", upstream: "get_message_content", risk: "READ", purpose: "Read rendered message content for debugging." },
  { external: "courier.message.history.get", upstream: "get_message_history", risk: "READ", purpose: "Read the message delivery pipeline history." },
  { external: "courier.user.profile.get", upstream: "get_user_profile_by_id", risk: "READ", purpose: "Read a Courier user profile." },
  { external: "courier.user.list_subscriptions.get", upstream: "get_user_list_subscriptions", risk: "READ", purpose: "Read list subscriptions for a user." },
  { external: "courier.list.list", upstream: "list_lists", risk: "READ", purpose: "List Courier recipient lists." },
  { external: "courier.list.get", upstream: "get_list", risk: "READ", purpose: "Read one Courier list." },
  { external: "courier.list.subscribers.get", upstream: "get_list_subscribers", risk: "READ", purpose: "Read subscribers for a Courier list." },
  { external: "courier.notification.list", upstream: "list_notifications", risk: "READ", purpose: "List notification templates." },
  { external: "courier.notification.get", upstream: "get_notification", risk: "READ", purpose: "Read notification template metadata." },
  { external: "courier.user.preferences.get", upstream: "get_user_preferences", risk: "READ", purpose: "Read a user's Courier notification preferences." },
  { external: "courier.user.profile.upsert", upstream: "create_or_merge_user", risk: "WRITE", purpose: "Create or merge a user profile. Approval required." },
  { external: "courier.list.subscribe", upstream: "subscribe_user_to_list", risk: "WRITE", purpose: "Subscribe a user to a Courier list. Approval required." },
  { external: "courier.user.preference.update", upstream: "update_user_preference_topic", risk: "HIGH_RISK", purpose: "Change notification preference state. Explicit approval required because it can affect communication consent/routing." },
  { external: "courier.message.send", upstream: "send_message", risk: "HIGH_RISK", purpose: "Send an external notification through Courier. Explicit human approval required." },
  { external: "courier.automation.invoke", upstream: "invoke_automation_template", risk: "HIGH_RISK", purpose: "Invoke a Courier automation template that may send external messages. Explicit human approval required." }
] as const;

export const ROUTE_BY_EXTERNAL = new Map(TOOL_ROUTES.map((route) => [route.external, route]));
