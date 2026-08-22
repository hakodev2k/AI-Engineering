# Workflow — Discover, Assess, Activate

## Trigger
New MCP server, reconnect, metadata refresh, or descriptor fingerprint change.

## Goal
Expose only policy-compliant MCP capability to an agent without trusting server-authored prose.

## Inputs
Raw discovery response, prior fingerprint inventory, trust policy.

## Baseline
Capture current active tools, scopes, descriptor fingerprints, and approval state.

## Stages
1. **Observe** — fetch metadata read-only; record server identity.
2. **Measure baseline** — compare current descriptors with approved inventory.
3. **Diagnose** — classify changes, collisions, imperative/injection indicators, and high-impact capabilities.
4. **Form hypothesis** — determine whether change is benign, suspicious, or policy-breaking.
5. **Implement improvement** — normalize metadata, isolate untrusted prose, update fingerprints only after approval.
6. **Measure again** — rerun deterministic validator.
7. **Independent verify** — MCP Security Reviewer confirms result.
8. **Activate** — enable only allowed tools/scopes.

## Checkpoints
Identity match; schema diff reviewed; collision-free naming; capability policy satisfied; approval attached where required.

## Metrics
Coverage=100%; changed descriptor detection=100%; malicious fixture block rate=100%; unauthorized scope expansion=0.

## Retry policy
Metadata fetch: max 2 transient retries. Validation failures: no retry without changed input/policy.

## Stop conditions
Stop on identity mismatch, unresolved collision, missing required approval, or failed validator.

## Failure path
Keep server/tool quarantined; preserve evidence; do not weaken policy.

## Definition of Done
Implemented: validator and policy wired. Measured: fixture results captured. Verified: independent reviewer passes and no blocking findings remain.
