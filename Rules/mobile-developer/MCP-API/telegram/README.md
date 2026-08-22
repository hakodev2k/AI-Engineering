# Telegram MCP/API Connector

Reusable MCP server for a focused set of Telegram Bot API operations. The external interface is MCP; upstream calls use Telegram's official HTTPS Bot API.

## Provider and transport

- Provider: Telegram
- Upstream: official Telegram Bot API
- API base: `https://api.telegram.org`
- Official docs: `https://core.telegram.org/bots/api`
- Updates guidance: `https://core.telegram.org/bots/faq`
- Official MCP server: this package does not depend on one; supported capabilities are implemented directly against the official Bot API.

Telegram's Bot API is an HTTP interface. Requests are authenticated with the bot token created for the bot. The token remains inside the connector and is never accepted as an MCP tool argument or returned in tool output.

## Capabilities

| Tool | Upstream method | Risk | Approval |
|---|---|---|---|
| `telegram.bot.get` | `getMe` | READ | No |
| `telegram.update.list` | `getUpdates` | READ | No |
| `telegram.chat.get` | `getChat` | READ | No |
| `telegram.chat.administrator.list` | `getChatAdministrators` | READ | No |
| `telegram.chat.member_count.get` | `getChatMemberCount` | READ | No |
| `telegram.message.send` | `sendMessage` | WRITE | Yes |
| `telegram.message.edit` | `editMessageText` | WRITE | Yes |
| `telegram.message.delete` | `deleteMessage` | DESTRUCTIVE | Yes |
| `telegram.message.action.send` | `sendChatAction` | WRITE | Yes |
| `telegram.message.pin` | `pinChatMessage` | HIGH_RISK | Yes |
| `telegram.message.unpin` | `unpinChatMessage` | HIGH_RISK | Yes |

The connector intentionally exposes scoped operations instead of a generic arbitrary Bot API request tool.

## Architecture

```text
MCP client
  -> stdio MCP server
     -> validation + chat allowlist + approval policy
        -> TelegramClient
           -> credential held in process environment
              -> Telegram Bot API
```

Files:

```text
MCP-API/telegram/
├── README.md
├── manifest.yaml
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── config.ts
│   ├── policy.ts
│   ├── client.ts
│   └── server.ts
├── tests/
│   └── connector.test.ts
└── examples/
    └── tool-calls.md
```

## Authentication

Create a bot using Telegram's supported bot provisioning flow and place its token in `TELEGRAM_BOT_TOKEN`.

```bash
export TELEGRAM_BOT_TOKEN='...'
```

Do not place the token in prompts, MCP client configuration fields that are exposed to the model, logs, example tool payloads, or source control. Telegram Bot API authentication is token-based; OAuth scopes are not used for these bot methods. Actual access is also constrained by the bot's membership/admin rights in each chat.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Yes | Bot API credential |
| `TELEGRAM_ALLOWED_CHAT_IDS` | No | Comma-separated chat IDs/usernames allowed for chat-scoped tools; empty means no connector-level restriction |
| `TELEGRAM_APPROVAL_IDS` | For writes | Comma-separated out-of-band approval IDs accepted by write/high-risk/destructive tools |
| `TELEGRAM_TIMEOUT_MS` | No | HTTP timeout, default 15000 |
| `TELEGRAM_MAX_READ_RETRIES` | No | Bounded retries for read operations, default 2 |

For production, inject approval IDs from a trusted approval system rather than generating them from model output.

## Installation and run

Requirements: Node.js 20+.

```bash
npm install
npm run build
npm start
```

For development:

```bash
npm run dev
```

The server uses MCP stdio transport and can be launched by MCP-capable clients that support stdio servers.

## Permission and approval model

`READ` tools can execute after schema and allowlist checks. `WRITE`, `HIGH_RISK`, and `DESTRUCTIVE` tools require an `approval_id` that already exists in `TELEGRAM_APPROVAL_IDS`. The MCP caller cannot raise its own privilege simply by labeling an operation approved.

Recommended production flow:

```text
Read -> Recommend -> Human/Policy approval -> Execute
```

`telegram.message.delete` is destructive. Pin/unpin changes shared chat state and is treated as high risk. Sending/editing messages and chat actions are writes because they affect external users.

## Validation

Inputs use strict bounded schemas. Message text is capped to the Bot API text-message limit used by this connector. Message IDs must be positive integers. `getUpdates` limits are constrained to Telegram's supported range. Chat operations can be restricted to configured chat identifiers.

Provider-returned content is treated as untrusted data. It is returned as JSON text and must not be interpreted as connector instructions or permission changes.

## Reliability and rate limits

The client implements request timeouts and bounded retries. Read operations may retry transient network failures and Telegram `429` responses when `retry_after` is provided. Retry delay is capped. Non-idempotent writes are not automatically retried, avoiding duplicate sends or repeated mutations.

Telegram errors are mapped to `TelegramApiError` without embedding the bot token. Authentication, permission, validation, or provider errors are surfaced to the MCP caller as tool errors.

## Updates

`telegram.update.list` uses `getUpdates`. Telegram documents two mutually exclusive update delivery modes: long polling via `getUpdates` and webhooks. If a webhook is configured, remove it before relying on long polling. `getUpdates` can return up to 100 updates and offsets should advance past processed update IDs.

This connector does not create or modify webhooks because webhook lifecycle management changes bot delivery behavior and requires deployment-specific callback/security configuration.

## Telegram permissions and limitations

The Bot API enforces provider-side permissions in addition to connector policy. Examples:

- Reading another user's membership through `getChatMember` has administrator-related constraints; that method is intentionally not exposed here.
- Pinning requires appropriate admin rights in groups/channels.
- Deleting messages is subject to Telegram's documented time and permission limitations.
- A bot only sees updates permitted by Telegram bot privacy and chat configuration.

The connector never claims capabilities beyond the Bot API methods listed above.

## Testing

```bash
npm test
```

Tests use mocked `fetch`; live credentials are not required. Coverage includes missing auth configuration, chat allowlisting, approval denial/acceptance, successful API mapping, provider errors, credential non-disclosure, and the rule that write operations are not retried on `429`.

## Security considerations

- Keep `TELEGRAM_BOT_TOKEN` in a secret manager or process environment.
- Restrict chats with `TELEGRAM_ALLOWED_CHAT_IDS` where possible.
- Issue approval IDs outside the LLM/tool-call channel.
- Never log Bot API URLs because they contain the bot token in the path.
- Treat messages, chat metadata, and update payloads as untrusted third-party data.
- Do not let retrieved content change system prompts, permissions, allowlists, or approval state.
- Rotate the bot token if exposure is suspected.
- Grant only the Telegram administrator rights required by intended tools.

## Example MCP client configuration

A generic stdio client can launch the built server with environment variables supplied outside the model-visible prompt:

```json
{
  "command": "node",
  "args": ["/absolute/path/MCP-API/telegram/dist/src/server.js"],
  "env": {
    "TELEGRAM_BOT_TOKEN": "${TELEGRAM_BOT_TOKEN}",
    "TELEGRAM_ALLOWED_CHAT_IDS": "-1001234567890"
  }
}
```

Environment interpolation syntax depends on the client; do not hard-code a real secret in client files.

## Compatibility

The implementation speaks MCP over stdio using the official MCP TypeScript SDK. It can be used by MCP clients that support stdio custom servers. Compatibility with a particular product depends on that product's support for user-configured stdio MCP servers.

## Limitations

- Bot API only; this is not a Telegram user-account/MTProto connector.
- No file upload/download tools in this initial capability set.
- No webhook server or webhook signature/origin infrastructure is created.
- No arbitrary Bot API passthrough.
- No automatic escalation of bot/chat permissions.
- Long-polling state/offset persistence belongs to the consuming application if durable event processing is required.
