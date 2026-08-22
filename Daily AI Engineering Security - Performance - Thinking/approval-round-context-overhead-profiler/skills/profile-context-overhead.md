# Skill: Profile Approval-Round Context Overhead

## Purpose
Measure repeated context-provider work inside one logical agent turn and identify safe optimization candidates.

## Trigger
Use when approval-enabled runs show high latency, repeated RAG/memory loads, many agent re-invocations, or timeouts.

## Inputs
Telemetry JSONL, provider metadata, approval configuration, baseline run set.

## Preconditions
A stable logical `turn_id` and provider invocation events must be available. Required approvals remain enabled.

## Required context
Provider purpose, read/write behavior, determinism, cacheability, model/tool round identifiers, approval round identifiers.

## Allowed tools
Telemetry readers, local scripts, benchmark harnesses, tracing systems, read-only repository inspection.

## Constraints
- MUST measure before optimizing.
- MUST NOT remove required approval to improve performance.
- MUST NOT reuse provider results unless the provider is read-only, deterministic for the fingerprint, and explicitly permitted.
- MUST preserve failure and authorization semantics.

## Procedure
1. Capture at least 20 representative turns or the largest reproducible set available.
2. Group provider calls by `(turn_id, provider, input_fingerprint)`.
3. Measure invocation count, duration, approval round, and result fingerprint.
4. Mark repeated work only when the input fingerprint is stable and no intervening state mutation invalidates it.
5. Form one optimization hypothesis at a time: per-turn memoization, provider lifecycle change, or framework-native inline approval path.
6. Run the same fixtures before and after the change.
7. Reject the change on correctness, approval, or latency regression beyond policy.

## Decision points
- Different input fingerprint: treat as new work.
- Same input but mutable provider: measure only; do not cache.
- Same input + read-only + deterministic: eligible for controlled reuse experiment.
- Approval semantics change: reject.

## Expected output
Baseline metrics, repeated-work groups, hypothesis, candidate change, before/after metrics, verification status.

## Metrics
Provider calls/turn, repeated calls/turn, provider milliseconds/turn, p95 latency, timeout rate, reuse hit rate, regression rate.

## Verification
A candidate is verified only when representative fixtures retain equivalent outputs/side effects, approvals still occur, and measured overhead improves.

## Failure handling
Retry measurement once for instrumentation errors and once for noisy benchmarks. Do not retry a semantic regression automatically.

## Stop conditions
Stop after two failed optimization hypotheses, any approval/security regression, or when savings are below the configured minimum.
