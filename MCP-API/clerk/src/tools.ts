import { z } from "zod";
import type { Risk } from "./policy.js";

const Id = z.string().min(3).max(200).regex(/^[A-Za-z0-9_:-]+$/);
const Limit = z.number().int().min(1).max(500).default(20);
const Offset = z.number().int().min(0).default(0);
export const ApprovalSchema = z.object({ confirmed: z.literal(true), reason: z.string().min(3).max(500) }).strict();

export type ToolDef = {
  name: string;
  description: string;
  risk: Risk;
  approvalRequired: boolean;
  schema: z.ZodTypeAny;
  invoke: (args: any, client: import("./client.js").ClerkClient) => Promise<unknown>;
};

const write = <T extends z.ZodRawShape>(shape: T) => z.object({ ...shape, approval: ApprovalSchema }).strict();
const read = <T extends z.ZodRawShape>(shape: T) => z.object(shape).strict();

export const TOOLS: ToolDef[] = [
  {
    name: "clerk.user.list", risk: "READ", approvalRequired: false,
    description: "List users with bounded pagination and optional Clerk query filtering.",
    schema: read({ limit: Limit, offset: Offset, query: z.string().min(1).max(256).optional() }),
    invoke: (a, c) => c.request("GET", "/users", { query: { limit: a.limit, offset: a.offset, query: a.query } })
  },
  {
    name: "clerk.user.get", risk: "READ", approvalRequired: false,
    description: "Get one Clerk user by user ID.",
    schema: read({ userId: Id }),
    invoke: (a, c) => c.request("GET", `/users/${encodeURIComponent(a.userId)}`)
  },
  {
    name: "clerk.user.update", risk: "WRITE", approvalRequired: true,
    description: "Update selected non-credential user profile fields. Does not expose password or MFA changes.",
    schema: write({ userId: Id, firstName: z.string().max(256).nullable().optional(), lastName: z.string().max(256).nullable().optional(), publicMetadata: z.record(z.unknown()).optional(), privateMetadata: z.record(z.unknown()).optional(), unsafeMetadata: z.record(z.unknown()).optional() }),
    invoke: (a, c) => { const { userId, approval, ...body } = a; return c.request("PATCH", `/users/${encodeURIComponent(userId)}`, { body, retryable: false }); }
  },
  {
    name: "clerk.organization.list", risk: "READ", approvalRequired: false,
    description: "List organizations with bounded pagination and optional query filtering.",
    schema: read({ limit: Limit, offset: Offset, query: z.string().min(1).max(256).optional() }),
    invoke: (a, c) => c.request("GET", "/organizations", { query: { limit: a.limit, offset: a.offset, query: a.query } })
  },
  {
    name: "clerk.organization.get", risk: "READ", approvalRequired: false,
    description: "Get one Clerk organization by organization ID.",
    schema: read({ organizationId: Id }),
    invoke: (a, c) => c.request("GET", `/organizations/${encodeURIComponent(a.organizationId)}`)
  },
  {
    name: "clerk.organization.update", risk: "WRITE", approvalRequired: true,
    description: "Update an organization's name, slug, or metadata.",
    schema: write({ organizationId: Id, name: z.string().min(1).max(256).optional(), slug: z.string().min(1).max(256).regex(/^[a-z0-9][a-z0-9_-]*$/).optional(), publicMetadata: z.record(z.unknown()).optional(), privateMetadata: z.record(z.unknown()).optional() }),
    invoke: (a, c) => { const { organizationId, approval, ...body } = a; return c.request("PATCH", `/organizations/${encodeURIComponent(organizationId)}`, { body, retryable: false }); }
  },
  {
    name: "clerk.organization.membership.list", risk: "READ", approvalRequired: false,
    description: "List memberships in an organization.",
    schema: read({ organizationId: Id, limit: Limit, offset: Offset }),
    invoke: (a, c) => c.request("GET", `/organizations/${encodeURIComponent(a.organizationId)}/memberships`, { query: { limit: a.limit, offset: a.offset } })
  },
  {
    name: "clerk.organization.invitation.list", risk: "READ", approvalRequired: false,
    description: "List invitations for an organization.",
    schema: read({ organizationId: Id, limit: Limit, offset: Offset, status: z.enum(["pending", "accepted", "revoked"]).optional() }),
    invoke: (a, c) => c.request("GET", `/organizations/${encodeURIComponent(a.organizationId)}/invitations`, { query: { limit: a.limit, offset: a.offset, status: a.status } })
  },
  {
    name: "clerk.organization.invitation.create", risk: "HIGH_RISK", approvalRequired: true,
    description: "Create an organization invitation and send an external invitation email. Explicit human approval is required.",
    schema: write({ organizationId: Id, emailAddress: z.string().email().max(320), role: z.string().min(1).max(100), inviterUserId: Id.optional(), redirectUrl: z.string().url().max(2048).optional(), expiresInDays: z.number().int().min(1).max(365).optional() }),
    invoke: (a, c) => { const { organizationId, approval, ...body } = a; return c.request("POST", `/organizations/${encodeURIComponent(organizationId)}/invitations`, { body: { email_address: body.emailAddress, role: body.role, inviter_user_id: body.inviterUserId, redirect_url: body.redirectUrl, expires_in_days: body.expiresInDays }, retryable: false }); }
  },
  {
    name: "clerk.session.list", risk: "READ", approvalRequired: false,
    description: "List sessions with bounded pagination; optionally filter by user or client ID.",
    schema: read({ limit: Limit, offset: Offset, userId: Id.optional(), clientId: Id.optional(), status: z.enum(["active", "revoked", "ended", "expired", "removed", "abandoned"]).optional() }),
    invoke: (a, c) => c.request("GET", "/sessions", { query: { limit: a.limit, offset: a.offset, user_id: a.userId, client_id: a.clientId, status: a.status } })
  },
  {
    name: "clerk.session.get", risk: "READ", approvalRequired: false,
    description: "Get one session by session ID.",
    schema: read({ sessionId: Id }),
    invoke: (a, c) => c.request("GET", `/sessions/${encodeURIComponent(a.sessionId)}`)
  },
  {
    name: "clerk.session.revoke", risk: "HIGH_RISK", approvalRequired: true,
    description: "Revoke a session, immediately affecting user access. Explicit human approval is required.",
    schema: write({ sessionId: Id }),
    invoke: (a, c) => c.request("POST", `/sessions/${encodeURIComponent(a.sessionId)}/revoke`, { body: {}, retryable: false })
  },
  {
    name: "clerk.invitation.create", risk: "HIGH_RISK", approvalRequired: true,
    description: "Invite an email address to the Clerk application and send an external invitation email.",
    schema: write({ emailAddress: z.string().email().max(320), redirectUrl: z.string().url().max(2048).optional(), publicMetadata: z.record(z.unknown()).optional(), notify: z.boolean().default(true) }),
    invoke: (a, c) => c.request("POST", "/invitations", { body: { email_address: a.emailAddress, redirect_url: a.redirectUrl, public_metadata: a.publicMetadata, notify: a.notify }, retryable: false })
  }
];

export const TOOL_BY_NAME = new Map(TOOLS.map(t => [t.name, t]));
