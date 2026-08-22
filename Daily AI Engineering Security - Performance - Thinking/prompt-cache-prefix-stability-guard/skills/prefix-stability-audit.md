# Skill — Prefix Stability Audit

## Purpose
Detect avoidable prompt-cache invalidation caused by host request construction rather than meaningful semantic changes.

## Trigger
Cache-hit regression, request-builder/tool-registry change, plugin update, model/provider migration, or release verification.

## Inputs
Baseline request manifest, candidate manifest, stable-segment policy, optional provider cache telemetry.

## Preconditions
Both manifests represent semantically equivalent tasks/tool availability unless the test intentionally validates a meaningful change.

## Required context
Segmented request data such as tools, system/static instructions, dynamic metadata, and message prefix. Secrets MUST be redacted before capture.

## Allowed tools
JSON inspection, canonical serialization, hashing, telemetry comparison, deterministic sorting.

## Constraints
Do not remove correctness-critical context to improve hit rate. Do not reorder messages where order carries semantics. Only canonicalize sets/maps whose ordering is non-semantic.

## Procedure
1. Define stable segments and volatile segments from policy.
2. Canonicalize JSON object keys.
3. For configured unordered arrays (for example tool definitions), sort using stable keys.
4. Hash each stable segment and the cumulative prefix.
5. Compare baseline and candidate fingerprints.
6. Locate first unexpected divergence.
7. Map divergence to registry order, dynamic bytes, schema change, or intended semantic change.
8. Implement stabilization only for non-semantic drift.
9. Re-run equivalent fixtures at least 5 shuffled registration orders.
10. Compare provider cache telemetry before/after when available.

## Decision points
Unexpected stable-segment divergence blocks performance verification. Intended instruction/schema changes are allowed but MUST be documented as expected cache invalidation.

## Expected output
Segment fingerprints, divergence classification, cache telemetry delta, and verification status.

## Metrics
Digest match rate, cache-hit ratio, cache-creation tokens/task, p50/p95 latency, cost/task, regression rate.

## Verification
Equivalent fixtures MUST produce identical stable-prefix digests across repeated shuffled executions.

## Failure handling
If manifests are incomplete, stop as invalid rather than guessing. Retry capture at most twice.

## Stop conditions
Success after deterministic digest stability plus no quality regression; stop blocked after two unexplained capture/regression attempts.