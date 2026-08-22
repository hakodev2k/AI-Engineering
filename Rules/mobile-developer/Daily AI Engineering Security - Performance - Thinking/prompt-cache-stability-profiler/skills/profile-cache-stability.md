# Skill — Profile Prompt Cache Stability

## Purpose
Diagnose prompt-cache misses caused by request-prefix drift rather than by context size alone.

## Trigger
Use when cached-input ratio falls, cache-creation tokens spike, resumed sessions become expensive, or a host change modifies system/tools/history serialization.

## Inputs
Two or more request dumps, segment mapping, optional token/cache telemetry, optional expected-volatile paths.

## Preconditions
Request dumps are sanitized; secrets and user-sensitive payloads are not copied into reports.

## Allowed tools
Read sanitized JSON, hash canonical segments, compare structure/order, calculate metrics, run deterministic profiler.

## Constraints
Do not reorder payloads merely to make a test pass unless provider semantics permit it. Do not remove correctness-critical context for cacheability.

## Procedure
1. Establish baseline request and cache metrics.
2. Partition request into declared-static and dynamic segments.
3. Fingerprint each static segment without mutating source data.
4. Compare next request against baseline.
5. Locate earliest static divergence by JSON path and segment.
6. Classify divergence: volatile field, nondeterministic ordering, history mutation, breakpoint movement, provider TTL, or intentional configuration change.
7. Form a minimal hypothesis and change only the responsible serializer/configuration.
8. Repeat identical workload at least three times.
9. Compare fingerprint stability, cache-read ratio, uncached tokens, and latency.
10. Accept only when correctness is unchanged and target regression thresholds pass.

## Decision points
If all static fingerprints match but cache misses remain, investigate provider TTL/breakpoint policy rather than rewriting prompts. If a divergence is intentional, move it into a dynamic segment or update the baseline explicitly.

## Expected output
Machine-readable diff report plus human summary of stable segments, earliest divergence, suspected cause, and before/after metrics.

## Metrics
Fingerprint stability rate, cache-read ratio, uncached tokens, cache-creation tokens, latency, cost if configured.

## Verification
Run unit tests and profile the same sanitized workload across repeated sessions/turns.

## Failure handling
If dumps are malformed or include secrets, stop analysis and fail the check. If telemetry is missing, report structural stability only and do not claim cache improvement.

## Stop conditions
Stop after one confirmed root cause plus successful repeated verification, or after three hypothesis cycles without improvement and escalate with evidence.
