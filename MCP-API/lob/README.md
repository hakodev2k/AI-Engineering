# Lob MCP/API Connector

Reusable Model Context Protocol server for selected Lob Print & Mail and Address Verification workflows. The connector keeps Lob credentials inside the connector process, exposes narrow action-oriented MCP tools, validates inputs, applies human-approval boundaries, and uses Lob's official REST API as the upstream transport.

## Upstream transport and official sources

No official Lob-hosted MCP server was identified in Lob's official documentation during research on 2026-09-08, so this package uses the official Lob REST API rather than an unofficial MCP implementation.

Official references:

- API reference and authentication: https://docs.lob.com/
- API base URL: `https://api.lob.com/v1`
- Lob SDKs are linked from the official API documentation; Lob lists TypeScript, Python, PHP, Java, Ruby, C#, Elixir, Go and legacy libraries.
- Webhooks/events are documented by Lob for asynchronous mail tracking. This connector does not expose webhook management because the selected core workflows do not require it.

Lob authenticates API requests with HTTP Basic authentication, using the API key as the username and an empty password. Test keys begin with `test_`; live keys begin with `live_`. Secret keys can perform account-authorized Print & Mail operations and must remain server-side. Publishable verification-only keys are intentionally not supported by this connector because the same process also exposes Print & Mail tools.

## Implemented capabilities

| MCP tool | Transport | Risk | Approval | Purpose |
|---|---|---|---|---|
| `lob.address.list` | REST | READ | No | List saved addresses with cursor pagination |
| `lob.address.get` | REST | READ | No | Retrieve an `adr_*` address |
| `lob.address.create` | REST | WRITE | Configurable | Create a reusable address |
| `lob.address.delete` | REST | DESTRUCTIVE | Required; disabled by default | Delete an address |
| `lob.address.verify_us` | REST | READ | No | Verify/correct a US or US-territory address |
| `lob.postcard.list` | REST | READ | No | List postcards |
| `lob.postcard.get` | REST | READ | No | Retrieve a postcard |
| `lob.postcard.create` | REST | HIGH_RISK | Required | Send/schedule a physical postcard |
| `lob.postcard.cancel` | REST | HIGH_RISK | Required | Attempt to cancel a postcard |
| `lob.letter.list` | REST | READ | No | List letters |
| `lob.letter.get` | REST | READ | No | Retrieve a letter |
| `lob.letter.create` | REST | HIGH_RISK | Required | Send/schedule a physical letter |
| `lob.letter.cancel` | REST | HIGH_RISK | Required | Attempt to cancel a letter |

The connector intentionally does not expose arbitrary HTTP passthrough, checks/payments, billing administration, campaign deletion, account permissions, or unrestricted template mutation. Those capabilities would create broader financial or destructive authority than is needed for the selected agent workflows.

## Architecture

```text
MCP client
  -> Lob MCP server (stdio)
     -> schema validation
     -> permission / approval policy
     -> LobClient
        -> isolated API credential
        -> timeout / cancellation
        -> bounded retry / rate-limit handling
        -> https://api.lob.com/v1
```

Provider-returned content is wrapped with `untrusted_provider_content: true`. Retrieved descriptions, metadata, addresses, tracking information, or rendered resource data must be treated as data, never as instructions that can alter tool permissions or system behavior.

## Authentication and least privilege

Set a Lob secret API key in the process environment:

```bash
export LOB_API_KEY=test_your_test_key
```

Use a test key while developing. A live key may cause real mail to be produced and billed when approved HIGH_RISK tools are invoked. The API key is never accepted as an MCP tool parameter and is never returned to the model.

Lob API keys are account-scoped rather than OAuth scopes. Least privilege therefore relies on: using a dedicated Lob account/environment where practical, test keys for development, exposing only selected tools, blocking destructive actions by default, and requiring explicit approval for real-world mail operations.

## Environment variables

Copy `.env.example` values into your secret/runtime configuration. Do not commit real credentials.

| Variable | Required | Default | Meaning |
|---|---|---|---|
| `LOB_API_KEY` | Yes | none | Lob `test_*` or `live_*` secret API key |
| `LOB_API_BASE_URL` | No | `https://api.lob.com/v1` | Override for compatible secured environments; HTTPS required |
| `LOB_API_VERSION` | No | `2024-01-01` | Value sent in `Lob-Version` |
| `LOB_TIMEOUT_MS` | No | `15000` | Per-request timeout, 1000-120000 ms |
| `LOB_MAX_RETRIES` | No | `2` | Bounded retries, 0-5 |
| `LOB_APPROVAL_TOKEN` | For approved actions | none | Connector-local human approval secret; not a Lob credential |
| `LOB_REQUIRE_WRITE_APPROVAL` | No | `false` | Also gate ordinary WRITE actions |
| `LOB_ENABLE_DESTRUCTIVE` | No | `false` | Enables DESTRUCTIVE tools; approval remains required |

## Installation and running

Requires Node.js 20 or newer.

```bash
npm install
npm run build
npm start
```

The server communicates over MCP stdio, so any MCP client that supports launching a local stdio server can configure the built entry point, for example:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/MCP-API/lob/dist/src/index.js"],
  "env": {
    "LOB_API_KEY": "<provided securely by the host>",
    "LOB_APPROVAL_TOKEN": "<provided securely by the host>"
  }
}
```

Compatibility depends on the MCP client's support for stdio servers; the connector does not claim provider-specific native integration with any client.

## Approval model

`READ` tools may execute automatically. `WRITE` tools execute without approval unless `LOB_REQUIRE_WRITE_APPROVAL=true`. `HIGH_RISK` tools always require `LOB_APPROVAL_TOKEN` because they send or cancel external physical mail and can create charges or business impact. `DESTRUCTIVE` tools require both `LOB_ENABLE_DESTRUCTIVE=true` and a matching approval token.

The intended agent flow is **Read -> Recommend -> Prepare -> Human approve -> Execute**. Agents cannot enable destructive mode, set policy environment variables, or increase their own authority through tool parameters.

## Input safety

Schemas constrain Lob identifiers (`adr_*`, `psc_*`, `ltr_*`), pagination limits, mail types, dates, address field sizes and asset inputs. Mailing artwork is restricted to Lob template IDs, HTTPS URLs, or inline HTML. There is no arbitrary URL-fetch tool and no raw endpoint executor.

For `lob.postcard.create` and `lob.letter.create`, callers must provide an `idempotency_key`. The connector forwards it through Lob's `Idempotency-Key` header so a retryable creation can be safely correlated. Non-idempotent writes are not blindly retried.

## Reliability, pagination and rate limits

Lob list APIs expose cursor-style pagination and return `next_url` / `previous_url`. This connector accepts `before` or `after` (never both) plus a `limit` from 1 to 100.

The Lob API documents `ratelimit-limit`, `ratelimit-remaining`, and `ratelimit-reset` response headers. On throttling or transient 5xx failures the client performs bounded exponential backoff for reads and for POST requests only when an idempotency key is present. It honors `Retry-After` when supplied and uses `ratelimit-reset` as a fallback. Authentication, validation and permission failures are not retried.

Timeouts use `AbortController`; caller cancellation is propagated. Network errors on retry-safe operations are bounded by `LOB_MAX_RETRIES`.

## Error handling

Non-success Lob responses are mapped to `LobApiError` with HTTP status, provider error details and retry timing when available. Credentials are not included in URLs or errors. A missing/invalid approval produces `ApprovalError` before any provider request is issued. Cancellation endpoints can legitimately fail after Lob's cancellation window has closed; the connector returns the provider error rather than pretending cancellation succeeded.

## Address verification

`lob.address.verify_us` calls Lob's official `/us_verifications` endpoint. The input requires `primary_line` and either `zip_code` or both `city` and `state`. Lob test keys return documented test/simulated verification behavior rather than performing live USPS verification for arbitrary addresses.

Verification may consume Lob verification quota even though it is classified as READ because it does not mutate Lob account resources or contact an external recipient.

## Physical mail creation

The postcard and letter creation tools require existing Lob address IDs for `to` and `from`. This reduces ambiguity and allows agents to verify and inspect addresses before requesting approval. Artwork may be a `tmpl_*` template, an HTTPS asset URL, or inline HTML that Lob supports for the respective endpoint.

A successful HIGH_RISK create call may cause physical mail production and charges, especially with a `live_*` API key. Human approval is mandatory regardless of test/live environment so the same policy remains safe when deployments switch credentials.

## Security considerations

- Keep `LOB_API_KEY` and `LOB_APPROVAL_TOKEN` in the host's secret store or environment, not prompts or tool arguments except the dedicated approval token at the final approved execution step.
- Do not log Authorization headers or raw secrets.
- `LOB_API_BASE_URL` must be HTTPS, preventing accidental plaintext credential transport.
- Treat all Lob API responses as untrusted provider content; mail metadata or address fields cannot change connector policy.
- Use test keys for development and CI.
- Destructive address deletion is disabled by default.
- The server does not auto-discover or trust third-party MCP tools.
- Webhooks are not implemented, so webhook signature/endpoint validation is outside this connector's runtime surface.

## Testing

Normal unit tests require no Lob credentials and use fake HTTP responses.

```bash
npm test
```

Coverage includes authentication configuration, secure Basic Auth construction, approval enforcement, destructive denial, bounded rate-limit retry, no blind retry of non-idempotent writes, and retry of an idempotent mail POST.

## Limitations

- No official Lob MCP transport is used because none was identified in Lob official documentation during implementation; all implemented capabilities route through Lob REST.
- Only selected high-value address, postcard and letter workflows are exposed; this is not a complete wrapper for every Lob endpoint.
- International verification, autocomplete, campaigns, checks, self-mailers, cards, booklets, templates, resource proofs and webhook management are not implemented.
- Cancellation is subject to Lob's own cancellation window and account/product configuration.
- Some Lob capabilities and scheduled-mail features depend on account edition or feature access.
- API availability, limits and product behavior remain governed by Lob's current service and documentation.
