import { z } from "zod";
import type { QuoConfig } from "./config.js";
import { QuoClient } from "./client.js";
import { assertAllowed } from "./policy.js";

const e164 = z.string().regex(/^\+[1-9]\d{1,14}$/);
const id = z.string().min(2).max(120);
const page = z.object({ maxResults: z.number().int().min(1).max(100).default(20), pageToken: z.string().optional() });

export function buildTools(client: QuoClient, config: QuoConfig) {
  return {
    "quo.phone_number.list": async (input: unknown) => {
      const p = z.object({ userId: z.string().regex(/^US/).optional() }).parse(input);
      return client.request("/phone-numbers", { query: p });
    },
    "quo.conversation.list": async (input: unknown) => {
      const p = page.extend({ phoneNumbers: z.array(z.string()).max(100).optional(), userId: z.string().regex(/^US/).optional(), createdAfter: z.string().datetime().optional(), createdBefore: z.string().datetime().optional(), excludeInactive: z.boolean().optional() }).parse(input);
      return client.request("/conversations", { query: p });
    },
    "quo.message.list": async (input: unknown) => {
      const p = page.extend({ phoneNumberId: z.string().regex(/^PN/), participants: z.array(e164).min(1), userId: z.string().regex(/^US/).optional(), createdAfter: z.string().datetime().optional(), createdBefore: z.string().datetime().optional() }).parse(input);
      return client.request("/messages", { query: p });
    },
    "quo.message.send": async (input: unknown) => {
      const p = z.object({ from: z.string().regex(/^PN/), to: z.array(e164).length(1), content: z.string().trim().min(1).max(4000), userId: z.string().regex(/^US/).optional(), setInboxStatus: z.literal("done").optional(), approved: z.boolean() }).parse(input);
      assertAllowed(config, "HIGH_RISK", p.approved);
      const { approved, ...body } = p;
      return client.request("/messages", { method: "POST", body, retryable: false });
    },
    "quo.call.list": async (input: unknown) => {
      const p = page.extend({ phoneNumberId: z.string().regex(/^PN/), participants: z.array(e164).length(1), userId: z.string().regex(/^US/).optional(), createdAfter: z.string().datetime().optional(), createdBefore: z.string().datetime().optional() }).parse(input);
      return client.request("/calls", { query: p });
    },
    "quo.call.transcript.get": async (input: unknown) => {
      const p = z.object({ callId: z.string().regex(/^AC/) }).parse(input);
      return client.request(`/call-transcripts/${encodeURIComponent(p.callId)}`);
    },
    "quo.call.summary.get": async (input: unknown) => {
      const p = z.object({ callId: z.string().regex(/^AC/) }).parse(input);
      return client.request(`/call-summaries/${encodeURIComponent(p.callId)}`);
    },
    "quo.contact.custom_field.list": async () => client.request("/contact-custom-fields"),
    "quo.contact.list": async (input: unknown) => {
      const p = z.object({ externalIds: z.array(z.string().min(1).max(75)).optional(), maxResults: z.number().int().min(1).max(50).default(20), pageToken: z.string().optional() }).parse(input);
      return client.request("/contacts", { query: p });
    },
    "quo.contact.get": async (input: unknown) => {
      const p = z.object({ id }).parse(input);
      return client.request(`/contacts/${encodeURIComponent(p.id)}`);
    },
    "quo.contact.create": async (input: unknown) => {
      const p = z.object({ defaultFields: z.record(z.unknown()), customFields: z.array(z.record(z.unknown())).optional(), createdByUserId: z.string().regex(/^US/).optional(), source: z.string().min(1).max(72).optional(), sourceUrl: z.string().url().max(200).optional(), externalId: z.string().min(1).max(75).optional(), approved: z.boolean() }).parse(input);
      assertAllowed(config, "WRITE", p.approved);
      const { approved, ...body } = p;
      return client.request("/contacts", { method: "POST", body, retryable: false });
    },
    "quo.contact.update": async (input: unknown) => {
      const p = z.object({ id, externalId: z.string().max(75).nullable().optional(), source: z.string().max(75).nullable().optional(), sourceUrl: z.string().url().max(200).nullable().optional(), defaultFields: z.record(z.unknown()).optional(), customFields: z.array(z.record(z.unknown())).optional(), approved: z.boolean() }).parse(input);
      assertAllowed(config, "WRITE", p.approved);
      const { id: contactId, approved, ...body } = p;
      return client.request(`/contacts/${encodeURIComponent(contactId)}`, { method: "PATCH", body, retryable: false });
    },
    "quo.contact.delete": async (input: unknown) => {
      const p = z.object({ id, approved: z.literal(true) }).parse(input);
      assertAllowed(config, "DESTRUCTIVE", p.approved);
      return client.request(`/contacts/${encodeURIComponent(p.id)}`, { method: "DELETE", retryable: false });
    }
  } as const;
}

export type ToolMap = ReturnType<typeof buildTools>;
