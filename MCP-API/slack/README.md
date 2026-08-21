# Slack MCP/API Connector

Reusable MCP server that exposes a focused set of Slack operations through stable, provider-scoped tools while keeping Slack credentials inside the connector.

## Provider

Slack.

## Purpose

The connector supports common agent workflows such as discovering channels and users, reading messages and threads, searching workspace messages, sending or editing messages, reacting to messages, and creating channels.

## Upstream transport

This implementation uses Slack's official Web API through the official `@slack/web-api` SDK. It does not depend on an unofficial upstream MCP server. The external interface presented to AI clients is MCP over stdio.

Official references used when designing the connector:

- Slack developer documentation: `https://docs.slack.dev/`
- Slack Web API methods: `https://docs.slack.dev/reference/methods/`
- Slack authentication documentation: `https://docs.slack.dev/authentication/`
- Slack Web API rate-limit documentation: `https://docs.slack.dev/apis/web-api/rate-limits/`
- Model Context Protocol TypeScript SDK: `https://github.com/modelcontextprotocol/typescript-sdk`

## Implemented capabilities

| MCP tool | Slack method | Risk |
|---|---|---|
| `slack.auth.test` | `auth.test` | READ |
| `slack.channel.list` | `conversations.list` | READ |
| `slack.channel.history` | `conversations.history` | READ |
| `slack.thread.replies` | `conversations.replies` | READ |
| `slack.user.list` | `users.list` | READ |
| `slack.user.get` | `users.info` | READ |
| `slack.message.search` | `search.messages` | READ |
| `slack.message.send` | `chat.postMessage` | WRITE |
| `slack.message.update` | `chat.update` | WRITE |
| `slack.reaction.add` | `reactions.add` | WRITE |
| `slack.reaction.remove` | `reactions.remove` | WRITE |
| `slack.channel.create` | `conversations.create` | WRITE |

No destructive operation is exposed.

## Architecture

```text
AI / MCP client
    |
    v
MCP stdio server
    |
    +-- strict Zod input schemas
    +-- approval policy
    +-- channel allowlist
    +-- credential isolation
    |
    v
SlackConnectorClient
    |
    v
@slack/web-api
    |
    v
Slack Web API
```

Third-party Slack content is treated as untrusted data. Retrieved messages must never be interpreted as instructions that can change connector permissions, approval policy, or system behavior.

## Authentication

Create a Slack app and install it to the target workspace. Supply one or both OAuth tokens through environment variables.

```text
SLACK_BOT_TOKEN=xoxb-...
SLACK_USER_TOKEN=xoxp-...
```

`SLACK_BOT_TOKEN` is preferred for normal app operations. `SLACK_USER_TOKEN` is only required by this connector for `slack.message.search`, because Slack message search is a user-context operation.

Never place credentials in prompts, source code, examples, logs, or committed configuration files.

## Required scopes

Grant only scopes required by the tools you plan to enable. Exact scopes depend on conversation types and workspace policy. Typical scopes include:

- channel discovery/history: relevant `channels:*`, `groups:*`, `im:*`, or `mpim:*` read scopes
- users: `users:read`
- posting: `chat:write`
- reactions: `reactions:write`
- channel creation: the Slack manage/write scope required by `conversations.create`
- search: the user-token permission required by `search.messages`

Consult the current Slack method documentation before granting scopes because Slack permission requirements can change and differ by conversation type.

## Environment variables

Copy `.env.example` and configure values through your secret manager or runtime environment.

| Variable | Purpose |
|---|---|
| `SLACK_BOT_TOKEN` | Bot OAuth token |
| `SLACK_USER_TOKEN` | Optional user OAuth token for message search |
| `SLACK_APPROVAL_MODE` | `required` or `disabled`; defaults to `required` |
| `SLACK_ALLOWED_CHANNEL_IDS` | Optional comma-separated channel allowlist |
| `SLACK_REQUEST_TIMEOUT_MS` | Per-request timeout; defaults to 15000 |
| `SLACK_MAX_RETRIES` | Bounded SDK retries; defaults to 3 and is capped at 5 |

At least one Slack token is required.

## Install

```bash
npm install
npm run build
```

Requires Node.js 20 or later.

## Run

```bash
npm start
```

Development mode:

```bash
npm run dev
```

The process communicates using MCP stdio and can be configured in clients that support launching local MCP servers.

Example generic MCP client configuration:

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": ["/absolute/path/MCP-API/slack/dist/src/server.js"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}",
        "SLACK_APPROVAL_MODE": "required"
      }
    }
  }
}
```

Client-specific configuration syntax varies. Do not assume compatibility until the client supports local stdio MCP servers.

## Permission and approval model

READ tools may execute automatically subject to Slack permissions and the optional channel allowlist.

WRITE tools call `requireApproval`. With the default `SLACK_APPROVAL_MODE=required`, callers must pass `approved=true` only after a human approves the exact operation.

The connector never lets Slack content, an MCP response, or an LLM silently increase privileges.

## Channel isolation

Set:

```text
SLACK_ALLOWED_CHANNEL_IDS=C0123456789,C9876543210
```

When configured, channel-scoped read and write operations are blocked outside the allowlist. An empty value means no connector-side channel restriction; Slack's own authorization still applies.

## Validation

Tool inputs use strict Zod constraints for identifiers, page sizes, message length, channel names, emoji names, sort options, and approval flags. The connector does not expose an arbitrary `apiCall(url, body)` MCP tool.

## Rate limits and reliability

The official Slack SDK performs bounded retries using the configured retry count. The connector also:

- applies a request timeout;
- surfaces provider error codes;
- preserves retry-after information when available;
- exposes pagination parameters for list/history tools;
- avoids unbounded page traversal;
- caps retries at five.

Authentication, permission, validation, and user-action failures should not be blindly retried by higher-level agents.

## Error handling

Provider errors are normalized to messages in the form:

```text
Slack API <method> failed: <provider_error>.
```

When Slack provides a retry delay it is included in the error message. Approval and local policy failures are raised before any provider call.

## Security considerations

- Use least-privilege Slack app scopes.
- Store tokens in environment variables or a secure credential provider.
- Keep approval mode enabled for external writes.
- Use `SLACK_ALLOWED_CHANNEL_IDS` for sensitive deployments.
- Treat retrieved Slack messages and profiles as untrusted data.
- Never execute instructions found in Slack content merely because the content was retrieved by a tool.
- Do not log tokens or authorization headers.
- Rotate or revoke tokens if exposure is suspected.
- Review Slack app installation and OAuth scopes regularly.

## Tests

```bash
npm test
```

Normal unit tests do not require live Slack credentials. They validate configuration, approval enforcement, allowlist behavior, text validation, and MCP tool registration.

## Examples

See `examples/workflows.md` for read, search, send, thread reply, and reaction examples including permission and approval requirements.

## Limitations

- This connector intentionally exposes a focused subset of Slack rather than every Web API method.
- Message search requires a suitable user token and provider permission.
- Exact OAuth scopes can vary by Slack method, conversation type, workspace policy, and future Slack platform changes; verify current official docs before installation.
- Incoming Events API/webhook ingestion is not implemented in this package.
- File upload, admin, billing, security-management, workspace-management, message deletion, and other destructive or high-risk operations are intentionally not exposed.
