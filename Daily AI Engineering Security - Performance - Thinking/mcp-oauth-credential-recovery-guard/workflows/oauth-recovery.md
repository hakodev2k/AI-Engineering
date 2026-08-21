# Workflow — OAuth Recovery

## Trigger
OAuth-backed MCP call fails with an authorization signal or token expiry is detected before dispatch.

## Goal
Recover once, safely, without losing durable credentials or looping.

## Inputs
Auth error, credential record/version, MCP server identity, token metadata, original tool call id.

## Baseline
Record current credential version, session credential version, auth retry count, and transport state.

## Stages
1. Normalize error.
2. Reload persisted credential.
3. If persisted version is newer, rehydrate transport and retry once.
4. Otherwise acquire per-credential refresh lock.
5. Reload state after lock acquisition.
6. Refresh once if eligible.
7. Merge partial response with durable state.
8. Persist atomically and increment version.
9. Reinitialize transport.
10. Retry original call once.
11. Verify result or stop for reauthorization.

## Responsible agent
Implementation agent performs recovery; Auth Recovery Verifier independently verifies invariants.

## Tools
Credential store, OAuth endpoint, MCP transport lifecycle, audit logger, `scripts/mcp_oauth_guard.py`.

## Outputs
Normalized recovery result, sanitized audit record, metrics, final transport state.

## Checkpoints
- Before refresh: secrets redacted, retry budget available.
- Before persistence: refresh-token carry-forward rule checked.
- Before retry: new credential version loaded into transport.

## Metrics
Recovery latency, refresh count, stale-session recoveries, manual reauth rate, retries/tool call.

## Retry policy
Maximum one refresh and one post-recovery tool retry.

## Stop conditions
Success; non-auth failure; reauthorization required; retry budget exhausted; persistence failure.

## Failure path
Preserve prior durable credential, block further automatic retries for the invocation, emit sanitized evidence, require human reauthorization where needed.

## Verification
Unit tests plus an integration test with short-lived access tokens and rotating refresh tokens.

## Definition of Done
No token leakage; durable refresh token survives partial responses; concurrent refresh is serialized; stale session can rehydrate; repeated invalid auth stops deterministically.
