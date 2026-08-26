# Skill: Cache Churn Analysis

## Purpose
Diagnose sudden prompt-cache efficiency loss before an agent keeps paying for large repeated contexts.

## Trigger
A large-context session shows increased input cost/latency, lower cached-token ratio, repeated wait/status turns, or a context-compaction event.

## Inputs
Per-turn input tokens, cached tokens, cache-write tokens when available, latency, stable-prefix identifier, semantic-progress flag, and expected invalidation markers.

## Preconditions
Telemetry must correspond to one logical session and must not contain secrets or raw private prompt text.

## Required context
Provider cache semantics, task phase, known compaction/truncation events, and model/tool configuration changes.

## Allowed tools
Read-only usage telemetry, provider documentation, `scripts/cache_churn_guard.py`, unit tests.

## Constraints
- MUST NOT remove correctness-critical context solely to increase cache hit rate.
- MUST NOT assume every cache miss is a defect.
- MUST correlate cache changes with prefix/context mutations before concluding root cause.

## Procedure
1. Capture a pre-change baseline for at least three representative turns when available.
2. Compute cached/input ratio and identify large-context turns.
3. Mark intentional invalidations such as truncation, model switch, or system-prefix change.
4. Detect same-prefix cache collapse and expensive no-progress turns.
5. Form hypotheses: unstable prefix, hidden tool-schema mutation, session reconstruction, truncation, provider cache expiry, or orchestration polling.
6. Change one factor at a time.
7. Re-run representative workload and compare cache ratio, input tokens/task, latency and result quality.
8. Independently verify that context needed for correctness remains present.

## Decision points
If cache collapse is explained and bounded, record it. If unexplained collapse repeats beyond policy, block automatic continuation and require diagnosis or explicit cost acceptance.

## Expected output
Facts, cache events, hypotheses, measured before/after metrics, chosen action, risks, verification status.

## Metrics
Cached-token ratio; input tokens/task; cache-write tokens/task; latency p50/p95; expensive no-op turns; quality/regression rate.

## Verification
Tests pass and a representative workload shows equal/better task quality with reduced unexplained churn.

## Failure handling
Detection: guard exit 3 or quality regression. Evidence: telemetry plus change diff. Retry: maximum two optimization attempts. Fallback: restore previous context strategy. Escalation: provider/runtime owner. Stop: quality loss, ambiguous provenance, or exhausted retries.
