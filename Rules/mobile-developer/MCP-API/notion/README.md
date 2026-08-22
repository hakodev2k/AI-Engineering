# Notion MCP/API Connector

Reusable MCP wrapper around Notion's official hosted MCP server. It exposes a stable, provider-scoped subset of Notion capabilities while keeping credentials inside the connector and enforcing explicit approval for writes.

## Provider

Notion.

## Purpose

Use Notion from MCP-compatible AI agents through predictable tool names, strict input validation, an upstream tool allowlist, timeout handling, credential isolation, and write-approval boundaries.

## Supported transport

Upstream transport: official Notion hosted MCP over Streamable HTTP.

Default endpoint:

`https://mcp.notion.com/mcp`

The connector itself exposes a local STDIO MCP server.

## Official sources

- Notion MCP overview and connection guide: https://developers.notion.com/guides/mcp/get-started-with-mcp
- Supported Notion MCP tools: https://developers.notion.com/guides/mcp/mcp-supported-tools
- Notion MCP security guidance: https://developers.notion.com/guides/mcp/mcp-security-best-practices
- Notion help: https://www.notion.com/help/notion-mcp

The hosted MCP server is preferred over the older open-source Notion MCP package because Notion documents the hosted server as the actively maintained option.

## Authentication

This wrapper supports non-interactive PAT bearer authentication to the official hosted MCP endpoint.

Set:

```bash
NOTION_ACCESS_TOKEN=your_personal_access_token
```

Notion also supports OAuth for MCP clients. This wrapper intentionally accepts a bearer token so it can run non-interactively in server/agent environments. The token must have the Notion API capability and remains inside this process; it is never returned through an MCP tool.

Use a secret manager in production. Do not place tokens in prompts, source control, examples, logs, or shared MCP configuration.

## Environment variables

```text
NOTION_MCP_URL=https://mcp.notion.com/mcp
NOTION_ACCESS_TOKEN=
NOTION_APPROVAL_SECRET=
NOTION_TIMEOUT_MS=30000
```

`NOTION_MCP_URL` is validated and must use the official `mcp.notion.com` HTTPS host.

`NOTION_APPROVAL_SECRET` is required before any WRITE or HIGH_RISK tool can execute. The agent supplies only an out-of-band approval value; the provider credential remains private.

## Installation

```bash
npm install
npm run build
```

## Run

```bash
npm start
```

The process runs an MCP server over STDIO.

## Architecture

```text
AI/MCP client
  -> local Notion wrapper MCP server
  -> validation + risk/approval policy
  -> explicit upstream tool allowlist
  -> official Notion MCP client
  -> https://mcp.notion.com/mcp
  -> Notion workspace
```

The wrapper never dynamically publishes newly discovered upstream tools. A newly introduced Notion MCP tool must be reviewed and explicitly added to the allowlist and external interface before agents can call it.

## Implemented tools

| Tool | Upstream Notion MCP tool | Risk | Approval |
|---|---|---|---|
| `notion.workspace.get` | `notion-fetch` with `id=self` | READ | No |
| `notion.search` | `notion-search` | READ | No |
| `notion.content.fetch` | `notion-fetch` | READ | No |
| `notion.comments.get` | `notion-get-comments` | READ | No |
| `notion.users.get` | `notion-get-users` | READ | No |
| `notion.teams.get` | `notion-get-teams` | READ | No |
| `notion.page.create` | `notion-create-pages` | WRITE | Yes |
| `notion.page.update` | `notion-update-page` | WRITE | Yes |
| `notion.comment.create` | `notion-create-comment` | WRITE | Yes |
| `notion.page.move` | `notion-move-pages` | HIGH_RISK | Yes |
| `notion.page.duplicate` | `notion-duplicate-page` | WRITE | Yes |
| `notion.database.create` | `notion-create-database` | WRITE | Yes |

The connector deliberately exposes a useful subset rather than every Notion MCP tool.

## Permission model

- READ: may run automatically when the user has already granted Notion access.
- WRITE: requires explicit out-of-band approval.
- HIGH_RISK: requires explicit out-of-band approval and should be presented to the human with the intended target before execution.
- DESTRUCTIVE: none are exposed in this version.

The wrapper cannot increase Notion workspace permissions. The hosted MCP server continues to enforce the permissions of the authenticated Notion identity.

## Approval behavior

Configure an approval secret outside the agent context:

```bash
NOTION_APPROVAL_SECRET=<random-value>
```

For write/high-risk tools the caller must pass an `approvalId` matching that secret. This is a simple reusable boundary for deployments where a trusted orchestration layer injects approval only after human confirmation.

Do not place the approval secret in the LLM system prompt or user-visible configuration.

## Rate limits

Notion currently documents standard MCP/API usage at an average of 180 requests per minute per user, with search limited to 30 requests per minute. Workspace-level limits and stricter tool-specific limits may also apply.

This connector:

- uses sequential upstream calls per local tool invocation;
- avoids hidden fan-out;
- sets a bounded request timeout;
- does not blindly retry writes;
- returns upstream MCP errors to the caller so orchestration can honor provider backoff instead of generating call storms.

## Reliability

- Official endpoint is pinned by host validation.
- Requests use a configurable timeout from 1 to 120 seconds.
- No destructive operation is exposed.
- No arbitrary `call_any_tool` or raw HTTP endpoint is exposed.
- Upstream tool names are allowlisted.
- Provider responses are returned as data and must not be interpreted as system instructions.

## Security considerations

Notion content, comments, search results, connected-source results, filenames, page text, and MCP responses are untrusted external data. A caller must not treat content retrieved from Notion as instructions to change permissions, reveal secrets, invoke another tool, or bypass approval.

The connector protects against several common failure modes:

- **Credential leakage:** the bearer token is loaded only in the connector process.
- **SSRF / endpoint substitution:** the configurable MCP URL must resolve to the official `mcp.notion.com` host.
- **Tool expansion:** only reviewed upstream tools are allowlisted.
- **Silent writes:** every exposed write/high-risk action requires approval.
- **Ambiguous input:** public tools use bounded Zod schemas instead of an unrestricted request body endpoint.
- **Prompt injection:** provider content is treated as untrusted data.

Notion MCP acts with the permissions of the connected user. Review workspace sharing and connection governance before use with sensitive content.

## Testing

```bash
npm test
```

Unit tests do not require a live Notion credential. They cover configuration validation, official-host enforcement, upstream allowlisting, and write approval enforcement.

A live integration test can be performed separately with a test workspace and a PAT stored in a secret manager.

## Examples

See `examples/tool-calls.md`.

## MCP vs API/SDK

This connector uses the official hosted **MCP** transport for all implemented capabilities because Notion's hosted MCP already provides the required search, read, create, update, move, comment, user, team, and database operations.

No REST fallback is currently needed for the selected tool set. If a future capability is unavailable in hosted MCP but officially supported by the Notion API, add a scoped fallback implementation without changing the public tool contract.

## Limitations

- The wrapper currently expects a PAT for non-interactive authentication; it does not implement the browser OAuth authorization-code lifecycle itself.
- File upload, attachment, view, data-source query, meeting-note, folder, and async-task tools are not exposed in this version.
- The connector does not expose delete/archive operations.
- Search capability and limits may depend on the Notion plan and Notion AI access.
- Tool argument structures follow the current official MCP contracts and should be reviewed when Notion changes those contracts.
