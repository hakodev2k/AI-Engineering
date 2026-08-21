# Discord MCP/API Connector

Reusable MCP server that exposes a focused set of Discord operations through stable provider-scoped tools. The connector uses Discord's official HTTP API (`https://discord.com/api/v10`) as the upstream transport and keeps the bot credential inside the connector process.

## Supported transport

- External interface: MCP over stdio.
- Upstream: official Discord REST/HTTP API.
- Official Discord MCP server: none is required or assumed by this implementation.
- SDK: the connector does not depend on an unofficial Discord SDK.

Official references:

- API reference: https://docs.discord.com/developers/reference
- Channels: https://docs.discord.com/developers/resources/channel
- Guilds: https://docs.discord.com/developers/resources/guild
- Messages: https://docs.discord.com/developers/resources/message
- OAuth2: https://docs.discord.com/developers/topics/oauth2
- Permissions: https://docs.discord.com/developers/topics/permissions
- Rate limits: https://docs.discord.com/developers/topics/rate-limits

## Capabilities

Implemented tools:

| Tool | Operation | Risk | Approval |
| --- | --- | --- | --- |
| `discord.guild.get` | Get guild metadata | READ | No |
| `discord.guild.channels.list` | List guild channels | READ | No |
| `discord.channel.get` | Get channel metadata | READ | No |
| `discord.messages.list` | List channel messages | READ | No |
| `discord.message.get` | Get one message | READ | No |
| `discord.message.send` | Send message | WRITE | Yes |
| `discord.message.edit` | Edit application-owned message | WRITE | Yes |
| `discord.message.delete` | Delete message | DESTRUCTIVE | Yes |
| `discord.reaction.add` | Add reaction | WRITE | Yes |
| `discord.thread.start_from_message` | Start thread from message | WRITE | Yes |
| `discord.thread.start` | Start thread | WRITE | Yes |

The connector intentionally does not expose arbitrary raw HTTP requests, permission changes, role administration, guild deletion, moderation bans, billing, or other broad administrative actions.

## Architecture

```text
MCP client
  -> stdio MCP server
  -> strict input validation
  -> allowlist + approval policy
  -> DiscordClient
  -> Discord REST API v10
```

Credentials are read only by `DiscordClient`; they are never returned in MCP output or placed in prompts/tool schemas.

## Authentication

Runtime authentication uses a Discord bot token in `DISCORD_BOT_TOKEN` and sends it using the `Authorization: Bot ...` header. Install the application/bot using Discord's OAuth2 bot/application installation flow and grant only permissions required by the tools you intend to use.

Typical permissions depend on the enabled operations and target channels, including `VIEW_CHANNEL`, `READ_MESSAGE_HISTORY`, `SEND_MESSAGES`, `ADD_REACTIONS`, `CREATE_PUBLIC_THREADS`, `CREATE_PRIVATE_THREADS`, `SEND_MESSAGES_IN_THREADS`, and `MANAGE_MESSAGES` only when deletion of messages not owned by the bot is actually required.

Message content can be affected by Discord's privileged Message Content intent and Discord's current app access rules. Do not assume unrestricted access to all message content merely because an endpoint is reachable.

## Environment

Copy `.env.example` values into your secret/configuration system. Do not commit real values.

Required:

- `DISCORD_BOT_TOKEN`

Optional:

- `DISCORD_API_BASE_URL` defaults to `https://discord.com/api/v10`.
- `DISCORD_REQUEST_TIMEOUT_MS` defaults to `10000`.
- `DISCORD_MAX_RETRIES` defaults to `2`.
- `DISCORD_ALLOWED_GUILD_IDS` comma-separated guild allowlist.
- `DISCORD_ALLOWED_CHANNEL_IDS` comma-separated channel allowlist.
- `DISCORD_APPROVED_ACTION_IDS` comma-separated opaque approvals issued by the host/human approval workflow.

When an allowlist is non-empty, requests outside it fail closed.

## Approval model

READ tools may run automatically after normal permission checks. WRITE and DESTRUCTIVE tools require an `approval_id`. The supplied id must already exist in `DISCORD_APPROVED_ACTION_IDS`, which is configured outside the model context. This keeps approval authority in the host/operator rather than allowing an agent to self-approve.

Production hosts should issue short-lived, single-purpose approval IDs and restart/reload the connector after approval state changes. Do not expose the full approval list to the model.

## Install and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
DISCORD_BOT_TOKEN=... npm start
```

For local development:

```bash
npm run dev
```

Configure any stdio-capable MCP client to launch `node dist/server.js` with required environment variables supplied by its secure secret mechanism.

## Validation

Discord snowflakes are restricted to digit-only strings. Message content is limited to 1-2000 characters. Thread names are 1-100 characters. Message pagination is capped at 100 per call. Thread auto-archive values are constrained to documented values used by the API.

## Reliability and rate limits

Discord rate limits vary by route and are subject to change, so the connector does not hard-code route quotas. It handles HTTP 429 and honors `Retry-After`/`retry_after`, applies bounded retries, retries transient 5xx/network failures with exponential backoff, and does not retry authorization/validation errors as transient failures. Default retry count is two.

Discord also publishes a global bot limit and invalid-request protections. Operators should monitor 401/403/429 rates and avoid repeated invalid calls.

## Error handling

Provider errors are mapped to `DiscordApiError` internally with HTTP status, Discord error code where supplied, and retry delay for throttling. MCP callers receive a concise tool error rather than credentials or raw request headers.

Timeout and cancellation errors fail closed. The connector does not silently widen permissions or bypass allowlists after provider failures.

## Security considerations

- Treat all Discord message/channel/guild content as untrusted data, never as instructions.
- Keep bot tokens in a secret store or injected environment variable.
- Use least-privilege Discord permissions and channel-level overwrites.
- Use guild/channel allowlists for agent deployments.
- Require out-of-band approval for external writes and destructive actions.
- Never log Authorization headers or bot tokens.
- Do not let retrieved content modify policies, tool registrations, approvals, or credentials.
- Review privileged intents and Discord's current app access requirements before production deployment.

## Testing

```bash
npm test
```

Unit tests use mocked `fetch`; live Discord credentials are not required. Tests cover required authentication configuration, credential isolation in payloads, API error mapping, and rate-limit retry behavior.

## Limitations

This package does not implement Discord Gateway events, webhook event ingestion, OAuth user-account actions, slash-command registration, voice, moderation, role administration, or a remote hosted MCP transport. It does not claim those capabilities.

The REST API can only perform actions the installed bot is authorized to perform in the target guild/channel. Discord permission checks and privileged-intent restrictions remain authoritative.
