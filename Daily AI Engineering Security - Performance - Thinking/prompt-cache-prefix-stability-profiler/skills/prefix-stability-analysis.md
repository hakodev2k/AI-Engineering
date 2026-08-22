# Skill: Prefix Stability Analysis

## Purpose
Find application-side causes of prompt-cache misses and quantify whether a proposed stabilization improves token/cost/latency without reducing quality.

## Trigger
Cache-hit degradation, tool schema changes, prompt refactor, model/settings change, or cost regression.

## Inputs
Two or more request snapshots containing `tools`, `system`, `static_context`, plus provider usage metrics when available.

## Preconditions
Snapshots belong to the same task family. Secrets and user-sensitive content are redacted or locally processed.

## Allowed tools
`scripts/prefix_profiler.py`, provider usage telemetry, benchmark harness, source/config inspection.

## Constraints
Do not delete safety/correctness context merely to improve cache metrics.

## Procedure
1. Capture baseline request/usage samples.
2. Canonicalize tool definitions and strip configured volatile fields.
3. Fingerprint tools, system, static context, and combined prefix.
4. Compare adjacent/repeated requests and identify first divergent segment.
5. Trace divergence to prompt construction code/settings.
6. Form one stabilization hypothesis.
7. Implement the smallest deterministic change.
8. Re-measure cached ratio, uncached tokens, latency, and quality.
9. Accept only if configured regression gates pass.

## Decision points
- Prefix changed but task semantics did not: investigate application nondeterminism.
- Prefix stable but cache metrics regress: investigate provider/model/TTL/request-concurrency factors.
- Quality worsens: reject optimization.

## Expected output
Fingerprint/divergence report and measured before/after table.

## Metrics
Prefix change rate, cached input ratio, uncached tokens/task, cache writes/task, latency, quality regression.

## Verification
Independent benchmark run over at least the configured comparison window.

## Failure handling
Maximum two optimization cycles, then record unresolved cause and stop.

## Stop conditions
Stop if required context would need removal, quality falls outside threshold, or metrics cannot be measured reliably.
