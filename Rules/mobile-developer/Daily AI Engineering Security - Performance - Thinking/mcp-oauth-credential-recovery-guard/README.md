# MCP OAuth Credential Recovery Guard

## Category
Security

## Problem
Long-lived agent sessions can retain stale OAuth state after MCP access-token expiry, refresh-token rotation, or reauthentication. Partial token responses can also erase durable refresh credentials when merged incorrectly. The failure often appears as repeated tool errors rather than an explicit recoverable auth transition.

## Evidence
See `evidence/research.md` for current 2026 MCP specification requirements and multiple open Codex OAuth recovery reports.

## Existing approach
Hosts typically refresh tokens, retry 401s, ask for manual login, or rely on restarting a session. These paths are frequently implemented independently and may not coordinate persistent credentials with live transport/session caches.

## Existing limitations
Concurrent refreshes, stale session-local state, partial refresh responses, generic error mapping, and unbounded retries can keep workflows broken or unsafe.

## Proposed improvement
A deterministic recovery guard with versioned credential state, single-flight refresh, safe token-response merge, live transport rehydration, explicit auth-state classification, and one-shot retry limits.

## Architecture
```text
MCP tool dispatch
  -> pre-tool auth check
  -> credential version/expiry gate
  -> refresh lock + reload
  -> OAuth refresh (max 1)
  -> safe durable merge + atomic persist
  -> MCP transport rehydrate
  -> original tool retry (max 1)
  -> verify / reauth required
```

## Actual package tree
```text
mcp-oauth-credential-recovery-guard/
├── README.md
├── evidence/research.md
├── skills/recover-oauth-credentials.md
├── rules/auth-recovery-rules.md
├── subagents/auth-recovery-verifier.md
├── workflows/oauth-recovery.md
├── hooks/pre-tool-auth-check.md
├── scripts/mcp_oauth_guard.py
└── tests/test_mcp_oauth_guard.py
```

## Installation
Requires Python 3.9+ for the deterministic helper and a host integration point around MCP OAuth dispatch/refresh.

## Configuration
Map your credential store to a record containing safe metadata plus `access_token`, optional `refresh_token`, optional `expires_at`, and monotonic `version`. Never write raw tokens to application logs.

## Usage
Check state before dispatch:
```bash
python scripts/mcp_oauth_guard.py check-state --credential credential.json --session-version 4
```
Test safe merge behavior through the unit suite rather than printing real token values.

## Workflow
Follow `workflows/oauth-recovery.md`. The key invariant is one refresh transaction plus one post-recovery tool retry at most.

## Metrics
Track recovery success rate, stale-session events, manual reauth rate, duplicate refresh attempts, and auth retries per original tool call.

## Verification
```bash
python tests/test_mcp_oauth_guard.py
```
Then integration-test short-lived access tokens, refresh-token rotation, partial refresh responses, multiple live sessions, and unrecoverable invalid_grant.

## Safety
Never weaken TLS/PKCE/scope/audience requirements, never expose tokens, never retry indefinitely, and never broaden scopes during recovery.

## Failure handling
Preserve the last durable credential, stop automatic retries, emit sanitized evidence, and require explicit reauthorization when refresh cannot safely recover.

## Definition of Done
- Public evidence documented.
- Durable refresh token survives a partial successful refresh response.
- Rotated refresh token replaces the old token atomically.
- Stale live session is detected by version mismatch.
- Refresh is single-flight per credential family in host integration.
- Automatic auth retry is bounded.
- Unit and integration tests pass.
- No secrets appear in logs/test output.

## Customization
Adapt error classifiers and persistence locks to the host/provider, while preserving the MUST/MUST NOT rules and bounded state machine.
