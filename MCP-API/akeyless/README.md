# Akeyless MCP/API Connector

Reusable MCP server for Akeyless secrets-management workflows with credential isolation, strict paths, bounded retries, redaction, and explicit approval for secret reveal/deletion.

## Upstream strategy

Akeyless provides an official local MCP server through the Akeyless CLI (`akeyless mcp`) and an Agentic Runtime Authority MCP mode. The official CLI MCP is the preferred upstream option when a deployment already has an Akeyless Gateway/profile and wants the provider-maintained tool surface. This package exposes a deliberately small, stable provider-scoped MCP contract and uses Akeyless's official v2 REST API for those operations so callers do not depend on upstream tool-name/version changes. It does not proxy or auto-discover arbitrary upstream MCP tools. Unsupported operations are intentionally absent.

Official references researched for this connector:
- MCP/CLI: https://docs.akeyless.io/docs/cli-reference
- SDKs and regional API endpoints: https://docs.akeyless.io/docs/sdks
- API-key authentication: https://docs.akeyless.io/docs/auth-with-api-key
- Go SDK/API authentication example: https://docs.akeyless.io/docs/go
- Gateway rate limiting: https://docs.akeyless.io/docs/gateway-docker-advanced-configuration
- SecretlessAI / MCP security model: https://www.akeyless.io/secure-ai-agents/secretless-ai/

## Architecture

`MCP client → stdio MCP server → validation/approval gate → AkeylessClient → Akeyless v2 API`. Connector credentials are read only from environment variables and are never accepted as MCP tool parameters or returned to the caller. Provider content is untrusted data. Secret values are redacted by default; explicit reveal is HIGH_RISK.

## Authentication

Set `AKEYLESS_ACCESS_ID` and `AKEYLESS_ACCESS_KEY`. The connector exchanges them at `/api/v2/auth` for a session token and uses that token internally. Akeyless documents API-key authentication for CLI/SDK/automation but does not recommend it for production; production deployments should prefer an appropriate workload identity supported by Akeyless (for example cloud/OIDC-style methods) or run the official MCP server with an established Akeyless CLI profile/Gateway. This connector intentionally does not pretend that API keys are the strongest production choice.

Regional API base URLs are `https://api.akeyless.io`, `https://api.us.akeyless.io`, and `https://api.eu.akeyless.io`. Configure `AKEYLESS_API_URL`; HTTPS is enforced.

## Environment

Copy `.env.example`. `AKEYLESS_APPROVAL_TOKEN` is a host-side approval secret; it must not be placed in prompts. `AKEYLESS_TIMEOUT_MS` defaults to 15000 and `AKEYLESS_MAX_RETRIES` defaults to 2.

## Install and run

```bash
npm install
npm run build
npm start
```

The server uses MCP stdio and therefore works with MCP clients that can launch a local stdio server. Configure the client to execute `node <connector>/dist/server.js`. No claim is made for clients that do not support stdio MCP.

## Tools and permissions

| Tool | Risk | Approval | Transport |
|---|---|---|---|
| `akeyless.auth.validate` | READ | no | REST |
| `akeyless.secret.list` | READ | no | REST |
| `akeyless.secret.metadata` | READ | no | REST |
| `akeyless.secret.read_redacted` | READ | no | REST |
| `akeyless.secret.reveal` | HIGH_RISK | explicit | REST |
| `akeyless.secret.create` | WRITE | host-configurable | REST |
| `akeyless.secret.update` | WRITE | host-configurable | REST |
| `akeyless.secret.delete` | DESTRUCTIVE | explicit | REST |

Paths must be absolute and contain only conservative path characters. Values are bounded to 64 KiB. No arbitrary URL/request tool exists.

## Approval model

READ operations may run automatically. WRITE operations are intentionally separated so an MCP host can apply its own confirmation policy. HIGH_RISK and DESTRUCTIVE handlers additionally require the runtime approval token. Deletion is never retried automatically. Secret reveal requires approval because returning a secret to an agent/model expands its exposure boundary; prefer redacted tools or Akeyless SecretlessAI/Gateway brokering whenever the downstream workflow permits it.

## Reliability and rate limits

Requests use AbortController timeouts. Reads retry only HTTP 429 and 5xx responses, with bounded exponential backoff and `Retry-After` support. Authentication, create, update, and delete calls are not blindly retried. 4xx validation/auth/permission failures are surfaced immediately. Pagination tokens from `list-items` can be passed back through `paginationToken`. Akeyless Gateway deployments can additionally configure `GW_RATE_LIMIT` (calls/minute); service-side limits may vary by account/deployment, so the connector does not invent a universal quota.

## Error handling

Provider non-2xx responses become structured connector errors carrying status and optional retry-after information. Authentication requires user/operator action when credentials are absent/invalid. Network timeout/cancellation is surfaced rather than converted into a fake success.

## Security considerations

Do not expose `AKEYLESS_ACCESS_KEY`, session tokens, or approval tokens to the LLM. Do not log request bodies containing secrets. The base URL must use HTTPS, limiting SSRF-style configuration mistakes. Treat names, metadata, and any secret content returned by Akeyless as data, never as instructions. The connector does not auto-trust newly discovered MCP tools. For stronger AI-agent isolation, Akeyless documents SecretlessAI and Gateway-based brokering so target credentials can remain invisible to the agent.

## Testing

```bash
npm test
```

Unit tests use mocked fetch responses and require no live credentials. They cover path validation, approval denial/success, authentication isolation, read behavior, bounded throttling retry, write non-retry, and permission errors.

## Limitations

This connector covers static-secret workflows only. It does not implement dynamic secrets, PKI, encryption keys, PAM, role/permission administration, billing, or arbitrary API passthrough. The bundled REST auth implementation is API-key based; stronger production identities should be terminated through an Akeyless profile/Gateway or added as a separately reviewed auth transport rather than silently widening scopes. The official Akeyless MCP server is documented but not embedded or auto-discovered by this package.
