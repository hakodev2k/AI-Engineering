# Research — MCP OAuth Credential Recovery Guard

## Topic
MCP OAuth Credential Recovery Guard

## Category
Security

## Problem
Long-lived AI agent sessions that depend on OAuth-protected MCP servers can become stuck on expired, stale, or rotated credentials. A host may keep an old access/refresh token in session state, fail to preserve a refresh token when a provider omits it from a refresh response, or surface a generic tool failure instead of a recoverable authorization transition. The result is repeated tool failure, manual re-login, broken automations, and potentially unsafe retry behavior.

## Why it matters now
The MCP 2026-07-28 authorization specification explicitly requires clients to protect refresh tokens and notes that public clients must use refresh-token rotation. In July 2026, multiple Codex issues documented stale credential state, missing refresh-token carry-forward, failed re-registration, and generic `-32603` errors for recoverable OAuth failures.

## Affected users
- Developers using remote OAuth-backed MCP servers.
- Teams running unattended or recurring agent workflows.
- Platform builders supporting multiple sessions/devices against the same MCP account.
- Security teams that need safe refresh-token handling and bounded recovery.

## Current public evidence

### Observed evidence
1. OpenAI Codex issue #29630 (opened 2026-06-23) reports failure to recover from `invalid_client` / expired refresh credentials without manual re-authentication.
2. Codex issue #35327 (opened 2026-07-25) reports persisted credentials losing a durable refresh token when a provider legally omits `refresh_token` from a refresh response.
3. Codex issue #35344 (opened 2026-07-25) reports shared OAuth state becoming stale across devices and surfacing as generic `-32603 Internal error`, even though re-login recovered the credential.
4. Codex issue #14144 and related duplicates report successful re-authentication while an active session continues using stale refresh state until restarted.
5. MCP authorization/security guidance dated 2026-07-28 states that public clients must rotate refresh tokens and clients must keep refresh tokens confidential.

### Interpretation
The recurring engineering gap is credential lifecycle coordination, not OAuth itself. A robust agent host needs explicit state transitions for access-token expiry, refresh, refresh-token rotation, session cache invalidation, one-time retry, and re-authentication. Those transitions should be observable and deterministic rather than hidden inside generic tool-call retry loops.

### Proposed solution
A reusable OAuth recovery guard that sits before MCP tool dispatch and around the token-refresh path. It preserves durable refresh credentials across partial token responses, serializes refresh attempts per credential family, reloads shared credential state before retrying, maps auth failures into explicit recovery states, invalidates stale session caches, and permits at most one authenticated retry per tool invocation.

## Existing approaches
- OAuth access-token refresh using stored refresh tokens.
- Manual `mcp login` / reauthorization.
- Restarting the host or creating a new session to clear stale state.
- Provider-specific retry logic around 401 responses.
- Generic tool-call retry loops.

## Remaining limitations
- Rotating refresh-token families are sensitive to concurrent refresh attempts across sessions/devices.
- Partial refresh responses may omit a new refresh token; naive persistence can erase the previous durable token.
- Session-local caches may not observe credentials refreshed elsewhere.
- Generic JSON-RPC/tool errors hide the fact that the underlying state is recoverable authorization failure.
- Unbounded retries can repeatedly reuse invalid credentials and waste tokens/requests.
- Reauthorization is sometimes required, but should be explicit rather than inferred after repeated failures.

## Root-cause analysis
1. Credential state is duplicated between persistent storage and live session/transport objects.
2. Refresh-token rotation requires atomic/single-flight refresh semantics.
3. Partial OAuth responses are merged incorrectly with durable credential state.
4. Auth errors are collapsed into generic tool failures.
5. Recovery paths do not invalidate stale transport/session caches.
6. Retry policies are tool-centric instead of credential-state-centric.

## Improvement opportunity
Introduce a host-agnostic recovery state machine with deterministic merge rules and bounded retry behavior. Treat credentials as a versioned shared resource, preserve prior durable fields when a legal refresh response omits them, and rehydrate the live MCP transport after recovery.

## Metrics
- Successful silent recoveries / recoverable auth failures.
- Manual re-authentication rate.
- Repeated auth failures per tool invocation.
- Refresh attempts per credential family.
- Stale-session incidents after successful refresh.
- Percentage of refresh responses that preserve durable refresh credentials.
- Auth failures surfaced with explicit state vs generic internal error.

## Relevant sources
- MCP Authorization 2026-07-28: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/index.mdx
- MCP authorization security considerations 2026-07-28: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx
- OpenAI Codex #29630: https://github.com/openai/codex/issues/29630
- OpenAI Codex #35327: https://github.com/openai/codex/issues/35327
- OpenAI Codex #35344: https://github.com/openai/codex/issues/35344
- OpenAI Codex #14144: https://github.com/openai/codex/issues/14144
- OpenAI Codex #17265: https://github.com/openai/codex/issues/17265

## Evidence status
- Implemented: package utilities implement the recovery policy locally.
- Measured: target-host metrics must be collected after integration.
- Verified: only when unit tests plus host integration tests pass and repeated auth failures are bounded.
