# Skill: OAuth Correlation Audit

## Purpose
Audit concurrent OAuth redirect handling for transaction/session mix-up, overwrite, replay, and active-window routing hazards.

## Trigger
Use when an app supports more than one concurrent task/window/instance or when OAuth callbacks show mismatches or update unexpected sessions.

## Inputs
Flow-start records, callback records, session IDs, provider/issuer IDs, redirect URIs, state hashes, timestamps, PKCE metadata, mutation/audit logs.

## Preconditions
No raw authorization codes, access tokens, refresh tokens, cookies, or credentials are required for the audit.

## Allowed tools
Read-only logs, test harnesses, transaction-store inspection, deterministic correlation script.

## Constraints
Never log raw tokens/codes. Never downgrade state/PKCE/issuer validation. Never route callback by current UI focus or last active session.

## Procedure
1. Model each OAuth start as immutable transaction `(txn_id, state_hash, session_id, issuer, redirect_uri, created_at, expires_at)`.
2. Identify whether pending-flow storage supports multiple simultaneous transactions.
3. Verify callback lookup uses transaction state, not active window/session.
4. Verify state is single-use and atomically consumed before session mutation.
5. Verify issuer/provider and redirect identity match the initiating transaction.
6. Run two-flow race tests in both completion orders and simultaneously.
7. Run replay, expiry, unknown-state, and session-deletion tests.
8. Compare mutation log target with transaction's initiating session.
9. Record violations and classify root cause.

## Decision points
Any transaction/session mismatch blocks commit. Unknown or expired state is rejected. Missing issuer binding is a security finding. Concurrent flows may be disabled only as a documented safe fallback.

## Expected output
Facts, violations, race matrix, proposed fix seam, metrics, and verification status.

## Metrics
Wrong-session commits, rejected mismatches, concurrent success rate, replay acceptance (must be 0), orphan transaction count, callback latency.

## Verification
At least 100 randomized two-flow permutations plus deterministic race cases produce zero cross-session commits.

## Failure handling
Fail closed: reject callback without mutating any session. Preserve audit-safe metadata for diagnosis.

## Stop conditions
All race/replay/expiry tests pass, or a blocking correlation ambiguity requires human remediation.