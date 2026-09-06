# Attio MCP Connector

Reusable, provider-scoped MCP wrapper for Attio CRM. The connector exposes a stable set of Attio tools over stdio while routing implemented capabilities to Attio's **official hosted MCP server** at `https://mcp.attio.com/mcp`.

Research verified on 2026-09-06 against Attio's official MCP and developer documentation. Tool names were checked against Attio's official supported-tool catalog; exposed argument contracts were also cross-checked against current MCP connector metadata.

## Upstream strategy

Attio provides an official hosted MCP server. It supports OAuth-authenticated access to records, lists, notes, tasks, meetings, email content, workspace metadata, reporting, and other CRM capabilities. Because every capability implemented here is supported by the official MCP server, this package uses MCP rather than duplicating those operations through REST.

Attio also provides an official REST API at `https://api.attio.com/v2`. REST fallback was reviewed but is not required for the implemented tool surface. No unofficial MCP server is used as an upstream dependency.

Official sources:

- MCP overview, supported tools, security, and rate limits: https://docs.attio.com/mcp/overview
- Hosted MCP endpoint: https://mcp.attio.com/mcp
- Attio MCP product integration: https://attio.com/apps/mcp
- Developer/API documentation: https://developers.attio.com
- REST API documentation: https://docs.attio.com/rest-api/overview

## Architecture

```text
MCP client / AI agent
        |
        | stable attio.* tools
        v
This connector (stdio MCP server)
        |
        | policy + validation + allowlist
        | OAuth bearer credential stays here
        v
Official Attio MCP (Streamable HTTP)
https://mcp.attio.com/mcp
        |
        v
Attio workspace
```

Credentials are never accepted as MCP tool arguments and must never be placed in prompts. Provider-returned CRM data, notes, email bodies, meeting content, and reports are wrapped as `untrustedData: true`.

## Requirements

- Node.js 20+
- An Attio workspace
- OAuth authorization for the official Attio MCP server
- An OAuth access token made available to the connector process as `ATTIO_MCP_ACCESS_TOKEN`

Attio's hosted MCP authenticates as the Attio user. Access therefore follows that user's existing workspace permissions. The connector does not silently request, add, or elevate provider permissions.

## Authentication

Attio MCP uses OAuth. For native clients such as ChatGPT or Claude, Attio normally performs the browser authorization flow directly. This wrapper is intended for reusable/headless execution, so an OAuth-capable credential broker or host application should complete the Attio OAuth flow and inject the resulting access token into the connector process.

```bash
export ATTIO_MCP_ACCESS_TOKEN='...'
```

Do not commit tokens, log tokens, copy them into examples, or expose them to an LLM. Re-authorize when the token expires or is revoked.

Unlike direct Attio REST integrations, this MCP wrapper does not configure REST scopes itself. The hosted MCP connection acts as the authenticated Attio user and respects that user's workspace permissions.

## Environment variables

Copy `.env.example` into your secret/configuration system; do not commit a populated `.env`.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `ATTIO_MCP_ACCESS_TOKEN` | yes | none | OAuth bearer token for official Attio MCP |
| `ATTIO_MCP_URL` | no | `https://mcp.attio.com/mcp` | Endpoint; connector rejects non-official hosts/paths |
| `ATTIO_PERMISSIONS` | no | `read` | Local capability gate: `read`, `read,write`, or `read,write,destructive` |
| `ATTIO_REQUIRE_WRITE_APPROVAL` | no | `true` | Require explicit approval for WRITE tools |
| `ATTIO_APPROVAL_SECRET` | for approved writes | none | Secret held by the human-approval service |
| `ATTIO_TIMEOUT_MS` | no | `20000` | Upstream timeout, 1–120 seconds |

`destructive` is not enabled by default. This connector currently exposes no destructive Attio tool; the policy layer nevertheless implements the category so future expansion cannot silently inherit write permission.

## Installation

```bash
npm install
npm run build
npm test
```

Run the stdio MCP server:

```bash
npm start
```

Example MCP client configuration:

```json
{
  "mcpServers": {
    "attio": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/attio/dist/src/server.js"],
      "env": {
        "ATTIO_MCP_ACCESS_TOKEN": "${ATTIO_MCP_ACCESS_TOKEN}",
        "ATTIO_PERMISSIONS": "read"
      }
    }
  }
}
```

Use the client-specific secret injection mechanism rather than writing a real token into a JSON file.

## Implemented tools

| Tool | Upstream Attio MCP tool | Risk | Approval |
| --- | --- | --- | --- |
| `attio.workspace.whoami` | `whoami` | READ | no |
| `attio.record.search` | `search-records` | READ | no |
| `attio.record.list` | `list-records` | READ | no |
| `attio.record.get_many` | `get-records-by-ids` | READ | no |
| `attio.attribute.list` | `list-attribute-definitions` | READ | no |
| `attio.record.create` | `create-record` | WRITE | yes by default |
| `attio.record.upsert` | `upsert-record` | WRITE | yes by default |
| `attio.record.update` | `update-record` | WRITE | yes by default |
| `attio.list.list` | `list-lists` | READ | no |
| `attio.list.entries` | `list-records-in-list` | READ | no |
| `attio.list.add_record` | `add-record-to-list` | WRITE | yes by default |
| `attio.note.search` | `search-notes-by-metadata` | READ | no |
| `attio.note.get` | `get-note-body` | READ | no |
| `attio.note.create` | `create-note` | WRITE | yes by default |
| `attio.task.list` | `list-tasks` | READ | no |
| `attio.task.create` | `create-task` | WRITE | yes by default |
| `attio.task.update` | `update-task` | WRITE | yes by default |
| `attio.meeting.search` | `search-meetings` | READ | no |
| `attio.email.search` | `search-emails-by-metadata` | READ | no |
| `attio.email.get` | `get-email-content` | READ | no |
| `attio.report.run` | `run-basic-report` | READ | no |

The connector does not expose raw HTTP, arbitrary MCP tool execution, record merging, comment deletion, list deletion, API-key administration, billing changes, or permission changes.

## Permission and approval model

The connector has two independent gates:

1. `ATTIO_PERMISSIONS` determines whether the connector process is locally allowed to run READ/WRITE/DESTRUCTIVE categories.
2. WRITE calls require explicit approval by default even when `write` permission is enabled.

Approval is an HMAC-SHA256 over the tool name and canonicalized arguments (excluding `approvalId`). The approval system, not the AI agent, holds `ATTIO_APPROVAL_SECRET`. This binds approval to a specific action and arguments so a token approved for one record cannot be reused to modify another.

The policy sequence is:

```text
Read -> execute when READ is enabled
Write -> prepare/review -> human approval -> execute
Destructive -> explicit destructive permission + strong approval
```

Do not disable approval merely to make automation easier. If unattended writes are intentionally required, set `ATTIO_REQUIRE_WRITE_APPROVAL=false` only in a separately controlled environment with narrow Attio permissions and audit logging.

## Input validation

All public tools use provider-scoped names and strict Zod schemas. The connector limits string sizes, array sizes, pagination offsets, object/list slugs, nested value/report payload size, and per-call result limits. It never accepts an arbitrary URL or arbitrary upstream MCP tool name.

Attio has dynamic custom objects and attributes, so record values, report metrics/grouping specifications, sort definitions, and Attio's provider-native filter expression strings cannot be fully enumerated locally. They are bounded by this connector and validated again by the official Attio MCP server.

## Reliability

- Upstream calls time out after `ATTIO_TIMEOUT_MS`.
- READ operations use at most three attempts with bounded exponential backoff for transient timeout, throttling, and 5xx-like failures.
- WRITE operations are attempted once and are **not blindly retried**, because the first outcome could be unknown.
- Authentication, authorization, validation, and approval failures are not retried.
- Exposed list/search pagination is bounded to at most 50 results per call and offset 10,000.
- SIGINT/SIGTERM close the upstream MCP client and stdio server.

## Attio MCP rate limits

Attio documents per-workspace MCP tiers. As of 2026-09-06:

- Read: 100 requests/second
- Write: 25 requests/second
- Search: 300 requests/minute
- Semantic search: 2 requests/second
- Reporting: 2 requests/second

Tools in the same tier share a workspace bucket. The connector deliberately limits pagination and avoids internal fan-out. On rate-limit errors, reduce concurrency and retry only after the provider window resets.

See: https://docs.attio.com/mcp/overview#rate-limits

## Errors

The server maps common upstream conditions into actionable errors:

- expired/invalid OAuth -> re-authorize; do not expose credentials to the model
- permission denied -> verify Attio user access; never auto-escalate
- rate limited -> lower concurrency and retry later
- timeout -> read operations may retry within the bounded policy; writes are not retried automatically
- validation failure -> correct the tool input; do not retry unchanged input

Because an interrupted write can have an unknown provider outcome, verify Attio state before manually resubmitting it.

## Security considerations

- The upstream host/path is pinned to Attio's official MCP endpoint, reducing SSRF risk.
- Only explicitly allowlisted upstream MCP tools can be called.
- The agent never receives the Attio OAuth token or approval secret.
- Returned Attio text and email/note/meeting content is untrusted data, not instructions.
- Retrieved content cannot change local permissions, approval policy, endpoint configuration, or tool allowlists.
- Write approvals are argument-bound HMACs and are removed before forwarding upstream.
- Write operations are not automatically retried after timeout or transport failure.
- Do not log tool payloads if your CRM contains personal or confidential information.
- Revoke OAuth access and rotate approval secrets after suspected exposure.
- Review Attio workspace access separately; local connector policy cannot make an overprivileged Attio identity least-privileged by itself.

## Testing

Unit tests require no live Attio credentials:

```bash
npm test
```

Tests cover required authentication configuration, official-endpoint pinning, tool registration/allowlisting, pagination and input limits, permission denial, approval binding, email identifiers, and meeting search requirements. Production validation should additionally use a non-production Attio workspace to verify OAuth, current upstream MCP schemas, rate limits, and representative read/write workflows.

## Limitations

- The wrapper expects an OAuth access token to be supplied securely by its host/credential broker; it does not implement an interactive browser OAuth callback server.
- Attio's schema is dynamic. Some filter, value, sort, and report payloads are provider-native structures validated again by the official MCP server.
- The connector implements 21 high-value tools rather than every Attio MCP capability.
- Semantic note/email/call search, call-recording transcript retrieval, comments, list configuration changes, record merging, and SQL are intentionally not exposed in this version.
- `query-particle-sql` is not exposed because availability depends on billing plan and a narrower stable tool surface is safer.
- REST API fallback is not used because official MCP covers every capability implemented here.

## Examples

See [`examples/workflows.md`](examples/workflows.md) for discovery, safe upsert, note logging, task creation, and email-reading flows.
