# Heap MCP/API Connector

Reusable MCP server for safe, scoped Heap server-side ingestion, identity enrichment, and privacy deletion workflows.

## Upstream strategy
Heap's documented integration surface used here is REST; no official Heap MCP server is relied on. The connector exposes a stable MCP interface while calling only documented Heap HTTP APIs. Official references: Heap Developer API reference (`https://developers.heap.io/reference/track-1`, `/reference/identify-1`, `/reference/user-deletion`) and Heap identity guidance (`https://developers.heap.io/docs/using-identify`).

US traffic uses `https://heapanalytics.com`; EU ingestion uses `https://c.eu.heap-api.com`. Configure `HEAP_REGION=eu` for EU-resident data.

## Capabilities
| Tool | Transport | Risk | Approval |
|---|---|---|---|
| `heap.event.track` | REST | WRITE | configurable, default yes |
| `heap.event.track_batch` | REST | WRITE | configurable, default yes |
| `heap.user.properties.update` | REST | WRITE | configurable, default yes |
| `heap.user.identify` | REST | HIGH_RISK | always explicit |
| `heap.privacy.user_deletion.request` | REST | DESTRUCTIVE | explicit + feature enable |
| `heap.privacy.user_deletion.status` | REST | READ | no |

`identify` is high risk because incorrect identity merging can damage analytics integrity. Deletion is irreversible, disabled by default, and never automatically retried.

## Authentication and least privilege
Ingestion/identity endpoints use the configured Heap environment `app_id`; it remains inside the connector. Privacy deletion additionally requires the API key generated for Heap's privacy API. The connector exchanges `HEAP_APP_ID` + `HEAP_API_KEY` with Basic authentication for a short-lived privacy bearer token and never returns credentials to the MCP caller. Do not place secrets in prompts or tool arguments.

Copy `.env.example` and set only the credentials needed. `HEAP_API_KEY` is unnecessary unless privacy tools are used.

## Install and run
```bash
npm install
npm run build
npm test
npm start
```
The server uses MCP stdio and therefore works with MCP clients that can launch a local stdio server. Configure the client command as `npm start` in this directory and pass credentials through its environment/secret facility.

## Validation and reliability
Inputs are bounded with Zod. Track requires exactly one of `identity` or `user_id`; event names and identities are length-bounded; batch ingestion is capped at 1,000 events; privacy deletion is capped at 10,000 users. HTTP calls have cancellation timeouts and bounded exponential backoff. 429 and 5xx responses may retry; validation/auth/permission failures do not. Destructive deletion calls never retry blindly. `Retry-After` is preserved in mapped rate-limit errors when Heap supplies it.

Heap documents single-event Track at 30 requests per 30 seconds per identity/app ID. Batch calls should be preferred for high-volume ingestion. Limits can vary by endpoint/account; a 429 is treated as authoritative.

## Security
Provider data is returned with `trust: untrusted_provider_data`; callers must never treat retrieved/provider text as instructions. There is no arbitrary URL/request tool, preventing SSRF-style endpoint pivoting. Credentials are read only from the process environment. Tool callers cannot increase connector permissions. `HEAP_AUTO_APPROVE_WRITE=true` should only be used in a controlled workflow; HIGH_RISK and DESTRUCTIVE tools still require explicit approval. Set `HEAP_ENABLE_DESTRUCTIVE=true` only after operational review.

## Errors
Errors are normalized as `VALIDATION_ERROR`, `APPROVAL_REQUIRED`, `DESTRUCTIVE_DISABLED`, `AUTH_CONFIGURATION`, `AUTHENTICATION_FAILED`, `PERMISSION_DENIED`, `RATE_LIMITED`, `PROVIDER_ERROR`, `TIMEOUT`, or `NETWORK_ERROR`, with HTTP status and retry delay when available.

## Testing
`npm test` uses mocked fetch only and needs no live Heap credentials. Tests cover configuration, validation, permission/approval denial, region routing, rate-limit retry bounds, and the no-retry guarantee for destructive requests.

## Limitations
This connector intentionally does not expose arbitrary Heap HTTP calls, client-side browser/mobile SDK operations, analytics dashboard querying, account administration, or undocumented endpoints. It does not implement webhooks because this selected Heap surface is ingestion/identity/privacy oriented. Server-side event acceptance means Heap accepted the request; it is not proof that downstream analytics processing has completed.
