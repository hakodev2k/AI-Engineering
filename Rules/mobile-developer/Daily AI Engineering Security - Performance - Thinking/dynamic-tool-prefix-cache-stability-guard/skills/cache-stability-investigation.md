# Skill: Cache Stability Investigation

## Purpose
Find whether dynamic tool discovery causes avoidable prompt-prefix mutation, token waste, or latency regression.

## Trigger
Cache-hit degradation, increased cold input tokens, new MCP/tool-search integration, or tool-catalog refresh changes.

## Inputs
At least two model-request snapshots, tool catalogs, cache telemetry, token counts, latency samples, and provider cache semantics.

## Preconditions
Redact secrets. Preserve tool descriptions needed for correct selection. Establish a reproducible workload.

## Required context
Model/provider, tool-loading mode, serialization path, stable instruction blocks, and cache breakpoint placement.

## Allowed tools
Logs, request inspectors, provider usage metadata, `scripts/cache_prefix_audit.py`, benchmark harnesses, and read-only repository inspection.

## Constraints
Do not remove required security or correctness context. Do not infer cache hits from latency alone.

## Procedure
1. Capture a baseline across at least 10 representative turns.
2. Canonicalize each tool catalog and compute its fingerprint.
3. Compare raw-prefix fingerprints with semantic catalog fingerprints.
4. Classify mutations as required, avoidable serialization drift, order drift, discovery drift, or instruction drift.
5. Form one measurable hypothesis at a time.
6. Stabilize ordering/serialization or move truly dynamic state outside the stable prefix where provider rules permit.
7. Repeat the same workload and compare hit ratio, tokens, latency, and tool-selection quality.

## Decision points
- If semantic catalog changed, treat cache invalidation as potentially necessary.
- If semantic catalog is equal but raw prefix changed, classify as avoidable drift.
- If savings reduce tool-selection correctness beyond policy, revert.

## Expected output
Baseline, mutation classification, before/after measurements, changed files, and verification status.

## Metrics
Cache-hit ratio, cold input tokens/task, prefix mutations/session, p50/p95 latency, tool-selection success.

## Verification
Run deterministic fingerprint checks plus representative model-task regression tests.

## Failure handling
Maximum two optimization attempts. Revert changes that reduce correctness or hide required context. Escalate provider-specific cache ambiguity with captured request evidence.

## Stop conditions
Verified improvement; no avoidable mutation remains; quality regression exceeds tolerance; or two hypotheses fail.
