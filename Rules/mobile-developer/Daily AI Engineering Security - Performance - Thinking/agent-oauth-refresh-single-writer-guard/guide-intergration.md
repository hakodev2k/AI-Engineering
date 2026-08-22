# Integration Guide

This package is a control-plane pattern for long-running agents that use OAuth credentials. It does **not** implement a provider-specific login flow and deliberately does not accept raw tokens in its scripts.

## 1. Architecture contract

Split credential handling into two planes:

- **Secret plane:** OS keychain, cloud secret manager, encrypted database, or existing provider credential store. Only the auth client/broker can read token material.
- **Metadata plane:** credential id, generation, expiry, scopes/audience fingerprint, update time, lease ownership, worker binding. This package operates here.

The agent/model sees neither access nor refresh token values.

## 2. Add generation metadata

Every committed credential state must expose a monotonic generation:

```json
{
  "generation": 12,
  "expires_at": 1787198400,
  "scopes": ["repo:read"],
  "updated_at": 1787194800
}
```

Do not put tokens in this metadata JSON. `credential_lease_guard.py` rejects common secret fields by design.

## 3. Introduce a refresh broker

Make one host component responsible for refresh. Other processes request `GetCurrentCredential(credentialId)` or `EnsureFresh(credentialId)` rather than calling the token endpoint directly.

Required broker semantics:
1. observe current generation;
2. acquire exclusive refresh lease;
3. re-read generation;
4. skip if another writer already advanced it;
5. refresh once;
6. validate provider response and scope/audience invariants;
7. persist secret + metadata as one logical transaction;
8. publish generation-changed event;
9. verify through normal authenticated request path.

For a database store, use a transaction/CAS such as `UPDATE ... WHERE generation = @expected`. For a local store, use a single daemon or OS lock and atomic replacement. Never treat the sample directory lease as a distributed lock across machines.

## 4. Bind subagents by reference

At child dispatch, store:

```text
child_id -> credential_id + bound_generation
```

Do not inject the raw access token into the subagent's prompt, durable state, or task payload. The child should call a broker/tool transport that resolves the current credential immediately before an authenticated request.

If your runtime must initialize an SDK client with a concrete token, subscribe the host wrapper to generation-change events and rebuild/rebind that client when the generation changes.

## 5. Integrate the hooks

### Pre-dispatch
Validate metadata and record child generation.

### Pre-refresh
Use an exclusive lease. Example for a local single-host integration:

```bash
python scripts/credential_lease_guard.py acquire \
  --root .auth-guard \
  --credential provider-account-1 \
  --owner worker-123 \
  --ttl 30
```

A non-zero/busy result means **do not refresh**. Wait briefly, re-read generation, and adopt the winner's committed state.

### Pre-commit

```bash
python scripts/credential_lease_guard.py check-generation \
  --state runtime/credential-metadata.json \
  --expected 12
```

Only the holder of the lease and matching generation may commit generation 13.

### Post-commit
Publish only:

```json
{"credential_id":"provider-account-1","generation":13,"updated_at":1787194800}
```

Then rebind/quarantine stale children.

## 6. Error classification

Treat transport failures, 429, and selected 5xx as potentially retryable within policy. Treat OAuth errors such as `invalid_grant`, `invalid_client`, `unauthorized_client`, and `invalid_scope` as non-retryable by default.

A plain HTTP 401 is not enough information to decide to refresh. Inspect the provider's documented error body/classification and current generation first.

If the refresh request timed out after it may have reached the authorization server, do not immediately replay it. With refresh-token rotation the first call may already have invalidated the old token. Reconcile the current committed/provider state before another attempt.

## 7. Atomic persistence

The secret store and metadata generation should advance as one logical commit. Good options:
- one database transaction;
- a dedicated credential daemon owning the only writable store;
- encrypted secret manager version + transactional metadata pointer;
- local temporary-file write + fsync + atomic rename under a process lock, when all readers are local and the platform guarantees the semantics you require.

Reject persisted records missing required expiry/scope metadata. Never silently preserve a half-updated record.

## 8. Observability without secrets

Emit structured events like:

```json
{"event":"refresh_start","credential_id":"c1","generation":7,"owner":"p1","ts":1787191000}
{"event":"refresh_commit","credential_id":"c1","generation":8,"owner":"p1","ts":1787191002}
{"event":"child_request","credential_id":"c1","generation":8,"child_id":"agent-4","ts":1787191004}
```

Audit them:

```bash
python scripts/credential_state_audit.py auth-events.jsonl --policy config/policy.json
```

## 9. Verification sequence

1. Run `python -m unittest tests/test_credential_lease_guard.py`.
2. Add an integration test with 16 concurrent `EnsureFresh` callers and a mock rotating provider; assert one provider refresh.
3. Kill the refresh owner before token call, after token call but before commit, and after commit but before event publication.
4. Spawn children on generation G, rotate to G+1, and assert all requests after grace use G+1 or the child is quarantined.
5. Scan logs/traces for raw token values using your existing secret scanner/DLP pipeline.
6. Run a non-destructive authenticated probe through parent and child paths.

## 10. Production rollout

Use shadow/audit mode first: record generations and duplicate refresh attempts without changing the existing auth path. Establish a baseline for 401 rate, refresh count, and generation divergence. Then enable single-writer refresh for one credential/provider, verify, and expand gradually.

Do not deploy if the provider's refresh-token reuse/rotation semantics are unknown or if the integration cannot distinguish a stale write from a current generation.

## Customization

Adjust `config/policy.json` for provider-specific expiry skew, retryable status codes, grace period and required metadata. Preserve the invariants in `rules/engineering-rules.md` even when implementation technologies change.
