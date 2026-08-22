# Skill — Recover OAuth Credentials Safely

## Purpose
Recover an OAuth-backed MCP connection after an access-token or refresh-state failure without leaking credentials, looping indefinitely, or discarding a still-valid durable refresh token.

## Trigger
Use when an MCP call returns 401/invalid_token/invalid_grant/authorization-required, when token expiry is imminent, or when a successful external re-login has not propagated into the active session.

## Inputs
- Sanitized auth error classification.
- Credential record version/fingerprint; never raw tokens in logs.
- Access-token expiry metadata when available.
- Latest persisted credential state.
- Refresh response, if a refresh was attempted.
- MCP transport/session identifier.

## Preconditions
- HTTPS OAuth endpoints.
- Secrets stored in an approved credential store.
- Refresh operation can be serialized per credential family.
- A bounded retry policy exists.

## Allowed tools
Credential-store read/write, OAuth token endpoint, MCP transport reinitialize, structured audit logging, deterministic guard script.

## Constraints
- Never log access/refresh tokens.
- Never retry an authenticated tool call more than once after a recovery transition.
- Never erase an existing refresh token merely because a legal refresh response omits `refresh_token`.
- Never refresh concurrently for the same credential family without single-flight/locking.

## Procedure
1. Classify the failure as access-token expiry, invalid access token, invalid refresh token, stale live-session state, client-registration failure, or unknown.
2. Reload the latest persisted credential record before mutating anything.
3. Compare credential version/fingerprint with the live session. If persisted state is newer, rehydrate the transport and retry once without refreshing.
4. If refresh is allowed and a refresh token exists, acquire a per-credential refresh lock and reload state again.
5. Execute exactly one refresh transaction.
6. Merge the refresh response with durable state: replace fields explicitly returned; retain prior refresh token/scopes when omitted and semantically allowed.
7. Persist atomically with a monotonically increasing credential version.
8. Invalidate/recreate the MCP transport so it reads the new credential state.
9. Retry the original tool call once.
10. If recovery still fails with an auth error, stop and require explicit reauthorization; do not loop.

## Decision points
- Persisted credential newer than session? Rehydrate first.
- Refresh token absent/expired/revoked? Require reauthorization.
- `invalid_client` and dynamic registration supported? Re-register only through an explicit bounded recovery branch.
- Unknown/generic tool error with no auth evidence? Do not mutate credentials.

## Expected output
A structured result: `recovered`, `reauthorization_required`, `not_auth_failure`, or `recovery_failed`, plus sanitized reason, credential version transition, retry count, and transport-reinit status.

## Metrics
Recovery success rate, manual reauth rate, duplicate refresh attempts, stale-session recoveries, auth retries/tool call.

## Verification
Run `python tests/test_mcp_oauth_guard.py`; integration-test expiry, partial refresh response, concurrent stale session, and unrecoverable `invalid_grant` scenarios.

## Failure handling
Preserve last known durable credential, release locks, emit a sanitized audit event, block further automatic auth retries for that invocation, and request reauthorization where required.

## Stop conditions
Stop after one refresh transaction and one post-recovery tool retry, or immediately when reauthorization is required.
