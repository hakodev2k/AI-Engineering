# Workflow: Refresh and Verify

## Trigger
`list_changed`, reconnect, TTL expiry, server deployment, authorization-scope change, or stale-tool failure.

## Goal
Restore catalog consistency with minimal interruption and prove the model/client tool surface is current.

## Inputs
Previous catalog snapshot, authoritative `tools/list`, client-visible snapshot, connection metadata, thresholds.

## Baseline
Record stale failures per task, full-session restart count, refresh latency, catalog mismatch count, and recovery tokens/time for at least one representative scenario.

## Context
Use catalog metadata only; exclude credentials and unrelated conversation history.

## Stages
1. Observe the trigger and current transport/catalog state.
2. Measure the cached/visible catalog and recovery baseline.
3. Diagnose stale cache, missed notification, reconnect-without-refresh, pagination, or auth-scope cause.
4. State the expected post-refresh catalog and predicted metric change.
5. Refresh: reinitialize when needed, fetch full `tools/list`, invalidate stale cache, install the new catalog.
6. Measure again with the same scenario.
7. Verify independently with `subagents/capability-verifier.md` and fixture tests.
8. Complete with sanitized before/after evidence.

## Responsible agent
The host integration performs refresh; the Capability Verifier performs independent verification.

## Tools
`scripts/catalog_fingerprint.py`, MCP discovery, host logs/metrics, `tests/test_catalog_fingerprint.py`.

## Outputs
Baseline report, refresh event record, old/new fingerprints, mismatch diff, verification result.

## Checkpoints
Before refresh, identify authoritative source and trigger. Before retry, classify the failure. Before completion, require matching fingerprints and visibility of changed tools.

## Metrics
Refresh latency, stale tool-call failures, restart count, mismatch duration, cache hit rate, task completion latency.

## Retry policy
Maximum two network attempts. The second is allowed only for a transient connection failure or newly established session.

## Stop conditions
Malformed catalog, pagination loop, two failed refresh attempts, unresolved fingerprint mismatch, or inability to observe the client-visible catalog.

## Failure path
Mark the catalog `unknown/stale`, block changed-tool dispatch, preserve the last known snapshot, and require explicit recovery rather than looping.

## Verification
A semantic change must alter the fingerprint; order-only changes must not. After refresh, authoritative and visible fingerprints must match and the representative task must complete without a full restart.

## Definition of Done
Evidence documented; baseline captured; root cause identified; refresh implemented; tests pass; after metrics captured; catalogs consistent; restart/failure metric is improved or no worse; independent verifier returns PASS; residual risks documented.