# Loops MCP/API Connector

Reusable MCP server for Loops, the lifecycle/transactional email platform. The connector exposes a fixed, provider-scoped tool contract for contacts, mailing lists, events, transactional emails, and workflows while keeping credentials inside the connector.

## Transport decision

Loops now provides an **official remote MCP server** at `https://mcp.loops.so` using Streamable HTTP and OAuth. As of September 4, 2026, compatible clients use OAuth with Client ID Metadata Documents (CIMD), and the server exposes four generic tools: `search`, `describe`, `execute`, and `teams`.

For interactive clients, the official remote MCP is the preferred upstream. This connector is intended for reusable/headless deployments, where it deliberately uses the **official REST API** (`https://app.loops.so/api/v1`) with a server-side API key. That choice gives the connector a fixed allowlist of explicit operations instead of forwarding a generic `execute` tool whose reachable operation set can expand independently. Agent callers do not receive the API key and cannot issue arbitrary provider requests.

Official sources researched:

- Loops MCP: https://loops.so/agents/mcp
- REST/OpenAPI: https://loops.so/agents/api
- Workflows API: https://loops.so/agents/workflows
- Agent setup / SDK guidance: https://loops.so/agents/setup
- Official CLI: https://loops.so/agents/cli

Loops also publishes official SDKs for JavaScript, Go, Nuxt, PHP, and Ruby. The direct REST transport is used here to keep the MCP connector dependency surface small and to preserve a single transport across all implemented operations.

## Implemented tools

| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `loops.contact.find` | REST GET `/v1/contacts/find` | READ | No |
| `loops.contact.create` | REST POST `/v1/contacts/create` | WRITE | Yes |
| `loops.contact.update` | REST PUT `/v1/contacts/update` | WRITE | Yes |
| `loops.contact.delete` | REST POST `/v1/contacts/delete` | DESTRUCTIVE | Strong gate + approval |
| `loops.mailing_list.list` | REST GET `/v1/lists` | READ | No |
| `loops.event.send` | REST POST `/v1/events/send` | HIGH_RISK | Yes |
| `loops.transactional_email.list` | REST GET `/v1/transactional-emails` | READ | No |
| `loops.transactional_email.get` | REST GET `/v1/transactional-emails/{id}` | READ | No |
| `loops.transactional_email.send` | REST POST `/v1/transactional` | HIGH_RISK | Yes |
| `loops.workflow.list` | REST GET `/v1/workflows` | READ | No |
| `loops.workflow.get` | REST GET `/v1/workflows/{id}` | READ | No |
| `loops.workflow.create` | REST POST `/v1/workflows` | WRITE | Yes |
| `loops.workflow.update` | REST POST `/v1/workflows/{id}` | HIGH_RISK | Yes |

The connector intentionally does not expose arbitrary HTTP, API-key management, bulk marketing sends, workflow node deletion, suppression removal, or webhook creation/deletion.

## Real-world workflows

Typical read-first flows include finding a contact, inspecting mailing lists, reading published transactional templates, and auditing workflows. Mutating flows can then create/update a contact, trigger an event, send a transactional message, or create/update a workflow with an approval boundary.

`loops.event.send` is HIGH_RISK because an event can start a published workflow and cause external messages. `loops.transactional_email.send` is HIGH_RISK because it sends an external email. Contact deletion is DESTRUCTIVE and disabled by default.

## Authentication

Set `LOOPS_API_KEY` to an API key created in the Loops dashboard. Requests use:

```text
Authorization: Bearer <key>
```

The key never appears in MCP tool inputs or outputs. Browser/client-side use is intentionally unsupported; Loops documents CORS protection and recommends keeping API keys server-side.

## Environment

```text
LOOPS_API_KEY=                    # required
LOOPS_API_BASE_URL=https://app.loops.so/api
LOOPS_ALLOW_WRITE=false
LOOPS_ALLOW_DESTRUCTIVE=false
LOOPS_APPROVAL_MODE=required
LOOPS_TIMEOUT_MS=30000
LOOPS_MAX_READ_RETRIES=2
```

The base URL is configurable for testing, but every request is constrained to the configured origin to avoid an arbitrary-URL/SSRF tool surface.

## Installation and run

```bash
cd MCP-API/loops
npm install
npm run build
npm start
```

Node.js 20+ is required. The server uses MCP stdio and is usable by MCP clients that support launching stdio servers, including general-purpose desktop/CLI agent clients. See `examples/mcp-client.json`.

## Approval and permission model

READ tools execute automatically. Any WRITE/HIGH_RISK/DESTRUCTIVE tool requires `LOOPS_ALLOW_WRITE=true`. With the default `LOOPS_APPROVAL_MODE=required`, the call must also include:

```json
{ "approval": { "confirmed": true, "reason": "Human-approved purpose for this exact operation" } }
```

DESTRUCTIVE additionally requires `LOOPS_ALLOW_DESTRUCTIVE=true`. This prevents an agent from silently increasing its permission level.

## Validation and safety

- Tool inputs are validated with Zod and strict JSON schemas.
- Email addresses, UUID template IDs, identifier lengths, pagination bounds, and idempotency-key length are constrained.
- Provider content is returned as untrusted data, not interpreted as instructions.
- There is no generic `request`, `execute`, or arbitrary URL tool.
- External sends require approval.
- Workflow updates require the revision last read; Loops announced revision-safe workflow writes in August 2026, preventing stale edits from overwriting newer work.
- `addToAudience` on transactional sends is caller-visible and defaults to provider behavior; callers should leave it false/omitted for account emails unless marketing consent exists.

## Reliability and rate limits

Loops documents a limit of **10 API requests per second per team**. The connector:

- surfaces HTTP 429 with `Retry-After` when present;
- retries only READ requests on 429/5xx/network failures, using bounded exponential backoff with jitter;
- never blindly retries writes, sends, events, or deletes;
- supports `Idempotency-Key` for event and transactional sends (maximum 100 characters). Loops documents a 24-hour idempotency window and returns 409 when a key is reused;
- applies a bounded request timeout and maps authentication, throttling, conflict, and LMX/validation failures.

For caller-managed retries of sends/events, persist one business idempotency key and reuse it. Treat a provider 409 caused by that key as evidence that the original business operation was already accepted, not as permission to generate a new key and send again.

## Errors

Common provider statuses documented by Loops include 400 for bad requests/unpublished templates, 401 for invalid or disabled keys, 404 not found, 409 conflicts/idempotency reuse, 413 payload too large, 422 LMX compilation failures, and 429 throttling.

## Tests

```bash
npm test
```

Unit tests do not need live credentials. They cover authentication-header isolation, provider error mapping, permission denial, approval requirements, destructive gating, tool count/naming, risk classification, and identifier validation.

## Limitations

- The official remote MCP server is not proxied here because its OAuth+CIMD flow is designed for interactive authorized clients and its `execute` surface is broader than this connector's fixed allowlist.
- This connector implements a curated set of high-value APIs, not the full Loops OpenAPI specification.
- Workflow creation/update payloads are passed as structured JSON after policy validation; callers should first read the workflow/revision and follow the official Workflows API shape.
- Marketing campaign creation/sending, API-key lifecycle, destructive workflow-node operations, and suppression removal are intentionally not exposed.
