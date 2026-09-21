# Zapier MCP/API Connector

Reusable safety wrapper around Zapier's official hosted MCP server. It discovers the actions configured by the operator, exposes only an explicit allowlist through a local stdio MCP server, isolates Zapier/app credentials, labels provider output as untrusted data, requires argument-bound human approval for writes, and disables destructive actions.

## Upstream strategy

Zapier provides an official MCP implementation over Streamable HTTP. Current official documentation states that Zapier MCP connects MCP clients to 9,000+ apps and 40,000+ actions; the client chooses which app actions are available and Zapier manages connected-app credentials and rate limiting. Each successful MCP tool call consumes two Zapier tasks. This connector therefore uses the official MCP server rather than reimplementing thousands of app APIs. It deliberately does **not** expose API by Zapier's arbitrary HTTP-request capability because a scoped tool surface is safer.

Official sources:
- https://help.zapier.com/hc/en-us/articles/48308034391821-What-is-Zapier-MCP
- https://zapier.com/mcp
- https://help.zapier.com/hc/en-us/articles/44391660158733-How-to-get-started-with-API-by-Zapier

## Architecture

`MCP client -> local stdio server -> policy/allowlist -> official Zapier MCP (Streamable HTTP) -> Zapier-managed app connection -> provider`

Third-party credentials remain in Zapier. `ZAPIER_MCP_URL` itself is sensitive configuration and must never be put in prompts, logs, or source control.

## Capabilities

The actual Zapier action catalog is account/configuration dependent. At startup the connector discovers upstream tools and registers only exact names listed in `ZAPIER_MCP_ALLOWED_TOOLS`. This avoids documenting or inventing app-specific capabilities that are not enabled for the user.

Every exposed tool is named `zapier.<upstream-tool-name>`. Read/search tools may execute automatically. Create/send/post/update-style tools require approval. Delete/remove/cancel/revoke/disable/terminate-style tools are disabled.

## Authentication and permissions

Create/configure a Zapier MCP server in Zapier and connect the desired app accounts using Zapier's hosted authorization flow. Store its Streamable HTTP server URL in `ZAPIER_MCP_URL`. Zapier controls the actual connected-app scopes. Use least privilege when authorizing each app and expose only required actions in Zapier and again in this connector's allowlist.

Environment variables:
- `ZAPIER_MCP_URL` — required HTTPS Zapier MCP server URL; secret.
- `ZAPIER_MCP_ALLOWED_TOOLS` — required comma-separated exact upstream tool names.
- `ZAPIER_MCP_TIMEOUT_MS` — 1,000–60,000 ms; default 20,000.
- `ZAPIER_APPROVAL_SECRET` — minimum 16-character secret used to validate approval tokens.

## Install and run

Requires Node.js 20+.

```bash
npm install
cp .env.example .env
# Load the environment with your preferred secret manager/shell.
npm start
```

The local transport is stdio, so it can be launched by MCP clients that support stdio child servers. Compatibility with any named client depends on that client's current stdio MCP support; no client-specific behavior is assumed.

## Approval model

Risk is conservatively inferred from the discovered tool name/description. READ calls execute. WRITE calls require an HMAC-SHA256 approval token bound to the exact upstream tool name and JSON arguments. A trusted UI/controller should generate this token only after a human reviews those exact arguments; never give `ZAPIER_APPROVAL_SECRET` to the model. DESTRUCTIVE calls fail closed.

This wrapper adds a second authorization boundary; Zapier's own action configuration and account policies remain authoritative.

## Reliability and rate limits

Calls have a bounded timeout and propagate cancellation to the MCP SDK. Provider/MCP failures are returned as tool errors. The connector does not automatically retry writes, avoiding duplicate side effects. Zapier handles connected-app authentication, refresh and upstream rate-limit behavior; Zapier's documented MCP task accounting still applies, so callers should avoid unnecessary repeated calls.

## Security

- HTTPS endpoint required.
- Exact upstream tool allowlist; newly discovered tools are not trusted automatically.
- No raw arbitrary-request proxy.
- App credentials stay in Zapier and are never returned to the LLM.
- Write approvals are bound to exact arguments to prevent post-approval mutation.
- Destructive operations disabled.
- Retrieved provider content is wrapped with `source: untrusted_provider_data`; it must never be interpreted as system/tool instructions.
- Keep MCP URLs, approval secrets and app tokens out of logs and prompts.

## Testing

```bash
npm test
```

Unit tests require no live Zapier credentials and cover configuration validation, risk classification, write approval binding, destructive denial, and allowlist enforcement. Live connectivity is intentionally an operator integration test because it requires a user-specific Zapier MCP server.

## Limitations

Zapier's enabled tools are dynamic, so this connector cannot provide static per-app schemas in advance; the official upstream server owns those schemas. The local wrapper accepts a JSON `arguments` object and upstream Zapier performs action-specific schema validation. Risk classification is intentionally conservative but name/description based; operators must review their allowlist. Destructive operations are not supported. Webhook/event ingestion is not implemented because this connector is an on-demand MCP action bridge, not a Zap trigger receiver.
