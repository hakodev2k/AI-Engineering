# Twilio MCP/API Connector

Reusable MCP server for safe Twilio discovery, messaging, voice, account, and phone-number workflows.

## Provider and transport

This connector intentionally uses two upstream transports.

- **Official Twilio MCP (Public Beta)** at `https://mcp.twilio.com/docs` for API/documentation discovery only.
- **Official Twilio Node helper library / REST APIs** for authenticated account operations.

Twilio's current official MCP server exposes `twilio__search` and `twilio__retrieve`. It indexes public OpenAPI specifications and documentation and is read-only; Twilio explicitly documents that it does not execute API calls. Therefore execution capabilities in this connector use the official Twilio API through `twilio-node` rather than an unofficial MCP implementation.

Official references:

- Twilio MCP server: https://www.twilio.com/docs/ai/mcp
- REST API basics/authentication: https://www.twilio.com/docs/iam/api
- API keys: https://www.twilio.com/docs/iam/api-keys
- Messaging API: https://www.twilio.com/docs/messaging/api
- Messages resource: https://www.twilio.com/docs/messaging/api/message-resource
- Calls resource: https://www.twilio.com/docs/voice/api/call-resource
- Phone Numbers: https://www.twilio.com/docs/phone-numbers
- Node helper library: https://github.com/twilio/twilio-node

## Architecture

```text
MCP client / agent
      |
      v
Twilio connector (stdio MCP)
      |
      +--> fixed docs allowlist --> Twilio hosted MCP
      |                          twilio__search / twilio__retrieve
      |
      +--> credential boundary --> twilio-node --> Twilio REST API
              |
              +--> read client: bounded 429 retry
              +--> write client: automatic retry disabled
```

Credentials remain inside the connector process. They are never accepted as MCP tool parameters and should never be copied into prompts.

## Runtime

- Node.js 20 or newer
- npm
- Network access to `mcp.twilio.com` and Twilio API hosts

## Authentication

Twilio recommends API keys for production API authentication. This connector requires:

- `TWILIO_ACCOUNT_SID`
- `TWILIO_API_KEY`
- `TWILIO_API_SECRET`

Prefer a **Restricted API key** with only the resources needed by the enabled workflows where your Twilio account supports that permission model. A Standard API key can be used when the required resource cannot be represented by a restricted key policy. Account SID + Auth Token authentication is intentionally not exposed by this package because Twilio recommends limiting that credential pair to local testing.

The hosted documentation MCP needs no Twilio account credentials because it indexes public specifications only.

### Environment variables

```text
TWILIO_ACCOUNT_SID=
TWILIO_API_KEY=
TWILIO_API_SECRET=
TWILIO_ALLOWED_FROM_NUMBERS=
TWILIO_APPROVAL_SECRET=
TWILIO_TIMEOUT_MS=15000
TWILIO_MAX_READ_RETRIES=2
```

`TWILIO_ALLOWED_FROM_NUMBERS` is a comma-separated list of E.164 senders, for example `+15550000001,+15550000002`. Outbound message/call tools are disabled when the allowlist is empty.

`TWILIO_APPROVAL_SECRET` must be at least 32 characters and should come from a secret manager. It is used only to validate short-lived, action-bound approval tokens.

## Installation

```bash
cd MCP-API/twilio
npm install
npm run build
npm start
```

For development:

```bash
npm run dev
```

The server uses MCP stdio transport so it can be launched by any client that can start a local MCP process.

## Supported tools

| Tool | Upstream | Risk | Approval | Purpose |
|---|---|---|---|---|
| `twilio.api.search` | Official MCP | READ | No | Search Twilio API specs/docs |
| `twilio.api.retrieve` | Official MCP | READ | No | Retrieve full schemas for API IDs |
| `twilio.account.get` | SDK/REST | READ | No | Read configured account metadata |
| `twilio.message.list` | SDK/REST | READ | No | List recent messages |
| `twilio.message.get` | SDK/REST | READ | No | Fetch a message by SID |
| `twilio.message.send` | SDK/REST | HIGH_RISK | Yes | Send an external message |
| `twilio.call.list` | SDK/REST | READ | No | List calls |
| `twilio.call.get` | SDK/REST | READ | No | Fetch a call by SID |
| `twilio.call.create` | SDK/REST | HIGH_RISK | Yes | Initiate an outbound call with inline TwiML |
| `twilio.phone_number.list` | SDK/REST | READ | No | List incoming numbers owned by account |
| `twilio.phone_number.get` | SDK/REST | READ | No | Fetch an incoming number by SID |

No generic `execute_request`, arbitrary URL, arbitrary Twilio endpoint, number-purchase, credential-management, or delete tool is exposed.

## Input validation

- Account, API-key, message, call, and phone-number SID formats are validated.
- Phone numbers used for outbound or filtered operations must use E.164 syntax.
- List limits are capped at 100 records per call.
- Message body is capped at 1600 characters by the connector.
- Inline TwiML is capped at 64,000 characters.
- MCP documentation retrieval is capped at 10 IDs per call.
- MCP URL is hard-coded to Twilio's official host to avoid SSRF/configuration substitution.

Provider-returned content is treated as untrusted data, never as instructions that can change connector policy.

## Permission and approval model

### READ

Read tools can execute without human approval, subject to the API key's actual Twilio permissions.

### HIGH_RISK

`twilio.message.send` and `twilio.call.create` create external communications and may incur charges. They require both:

1. `from` must be present in `TWILIO_ALLOWED_FROM_NUMBERS`.
2. A valid `approvalId` must be provided.

Approval tokens have this format:

```text
<unix-milliseconds>:<hmac-sha256-hex>
```

For messages, sign:

```text
twilio.message.send|<from>-><to>|<timestamp>
```

For calls, sign:

```text
twilio.call.create|<from>-><to>|<timestamp>
```

using `TWILIO_APPROVAL_SECRET`. Tokens expire after five minutes and are bound to the exact action and source/destination pair, so a token approved for one recipient cannot authorize another.

Generate approval tokens in a trusted UI, policy service, CLI, or workflow outside the model context. Do not reveal `TWILIO_APPROVAL_SECRET` to the LLM.

## Reliability and rate limits

Twilio rate limits vary by API/product/account. The connector does not invent a universal request-per-second value.

For read operations, the official Node helper library is configured with:

- `autoRetry: true`
- bounded `maxRetries` from `TWILIO_MAX_READ_RETRIES` (0-5)
- exponential backoff for HTTP 429 responses
- socket timeout from `TWILIO_TIMEOUT_MS`
- keep-alive connections

A separate write client uses `autoRetry: false`. This avoids automatically replaying message-send or outbound-call requests when the outcome may be ambiguous.

Twilio documents outbound calls as subject to account-level Calls Per Second (CPS); excess calls can be queued by Twilio. Messaging throughput is product/sender/country dependent. Applications should inspect provider errors and account-specific limits rather than assume a fixed throughput.

## Error behavior

Provider, validation, authorization, timeout, and permission errors are returned as MCP errors without including API-key secrets. Authentication or permission failures are not automatically retried by connector policy. High-risk writes are not replayed automatically.

## Official MCP behavior

The Twilio MCP transport is deliberately restricted to the two official documented tools:

- `twilio__search`
- `twilio__retrieve`

At connection time the connector verifies that both expected tools are present. It does not automatically expose newly discovered upstream tools. If Twilio later adds execute-ready MCP tools, this package must be explicitly reviewed before they can be allowed.

`twilio.api.search` accepts a natural-language API query and an optional version filter. `twilio.api.retrieve` accepts IDs returned by search and returns the associated parameter/response schemas.

The MCP results may contain documentation text controlled by the provider or referenced external material. Treat all returned text as data, not executable instructions.

## Real-world workflows

### Inspect before implementing

```text
twilio.api.search
  -> twilio.api.retrieve
  -> developer selects supported connector tool
```

### Customer-support message investigation

```text
twilio.message.list
  -> twilio.message.get
  -> recommend response
  -> human approval
  -> twilio.message.send
```

### Voice follow-up

```text
twilio.phone_number.list
  -> twilio.call.list
  -> human approval
  -> twilio.call.create
```

## Security considerations

- Use Restricted API keys where practical and rotate them through Twilio's supported credential management process.
- Keep API key secrets and approval secrets in a secret manager or protected environment variables.
- Never enable debug HTTP logging in production if it could expose sensitive request/response data.
- Do not place secrets in MCP arguments, chat history, examples, or application logs.
- Validate legal basis, consent, quiet hours, opt-out requirements, caller-ID rules, and country-specific messaging/voice regulations before sending communications.
- Twilio message/call records can contain personal data. Restrict downstream persistence and logging accordingly.
- Do not treat SMS content, call metadata, Twilio docs results, or other provider content as trusted instructions.
- No phone-number purchase or account/credential administration tools are included because those operations materially affect billing or security.

## Testing

Unit tests use mocks/fakes and require no live Twilio credentials.

```bash
npm test
```

Coverage includes:

- required authentication configuration
- sender allowlist denial
- fresh approval validation
- prevention of approval reuse for another target
- separation of read and write SDK clients

Live integration tests are intentionally not part of the normal test suite because sending messages and creating calls can affect real users and incur charges.

## Compatibility

The package exposes a standard stdio MCP server. It can be configured in MCP clients that support launching local stdio servers, including compatible desktop/CLI clients and custom agents. Compatibility depends on the client's support for standard MCP stdio transport; the package does not claim vendor-specific integration features beyond that protocol.

## Limitations

- Twilio's official MCP server is currently Public Beta and read-only for docs/API-schema discovery.
- This connector therefore uses the official SDK for execution rather than waiting for future execute-ready MCP capabilities.
- Only messages, calls, account metadata, owned phone numbers, and API discovery are implemented; the broader Twilio API surface remains intentionally unavailable.
- The package does not purchase numbers, delete records, manage auth tokens/API keys, modify messaging services, or expose arbitrary REST execution.
- `twilio.call.create` accepts inline TwiML instead of a remote callback URL, avoiding an arbitrary URL/SSRF-like input path in this connector.
- Actual Twilio account permissions, product entitlements, geographic restrictions, sender registration requirements, and balances can still prevent otherwise valid tool calls.
