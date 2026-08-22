# Skill: Cache Boundary Analysis

## Purpose
Find where an agent prompt stops being reusable and determine whether a cache-boundary or prompt-layout change is justified by measurements.

## Trigger
Use when cache-hit ratio drops, cache-write tokens increase, costs spike, a prompt/tool layout changes, a provider/model changes, or a subagent/resume path is introduced.

## Inputs
- Representative JSONL traces accepted by `scripts/cache_prefix_profiler.py`.
- `config/cache-policy.json`.
- Provider usage fields when available.
- A correctness/quality result for each representative task when available.

## Preconditions
- Use at least `minimum_samples` comparable runs.
- Keep task, model, repository state, and relevant provider settings controlled between baseline and candidate runs.
- Know whether the provider supports explicit breakpoints and stable cache keys.

## Required context
Prompt construction order, component ownership, provider cache semantics, compaction/resume behavior, and quality acceptance criteria.

## Allowed tools
Read-only trace inspection, provider usage logs, deterministic scripts, benchmark harnesses, and source inspection.

## Constraints
- MUST NOT remove security policy, task requirements, or required evidence to increase cache reuse.
- MUST NOT infer a provider guarantee from one successful cache hit.
- MUST distinguish cache reads, cache writes, and ordinary uncached input when the provider exposes them.

## Procedure
1. Capture at least three comparable baseline requests/tasks.
2. Represent each request as ordered `prefix_parts` with stable names and rendered content.
3. Run `python scripts/cache_prefix_profiler.py baseline.jsonl --policy config/cache-policy.json`.
4. Record component stability, earliest unstable component, cached ratio, cache-write ratio, latency, and quality pass rate.
5. Classify each component as required-static, required-volatile, movable-static, or removable-only-if-nonrequired.
6. Form one hypothesis, for example: deterministic sorting, moving a volatile block after a stable block, preserving cache lineage, or adding a measured explicit breakpoint.
7. Change only the hypothesized cause.
8. Repeat the same workload and profiler.
9. Compare before/after metrics. Reject the change if quality regresses beyond policy or correctness-critical context is lost.
10. Have an independent verifier inspect the final trace and acceptance evidence.

## Decision points
- If the earliest unstable component is correctness-critical and necessarily volatile, do not move/remove it; optimize only components before it or provider lineage.
- If instability is ordering-only, fix deterministic rendering before adding cache-specific APIs.
- If explicit breakpoints are unsupported, keep the layout optimization provider-neutral.
- If cache metrics improve but quality fails, revert.

## Expected output
A baseline report, a single causal hypothesis, candidate report, before/after comparison, and verified decision.

## Metrics
Cached ratio, cache-write ratio, uncached tokens/task, cost/task, p50/p95 latency, stable component count, earliest divergence, and quality pass rate.

## Verification
A candidate is verified only when repeated representative runs meet policy thresholds and the verifier confirms required context remains present.

## Failure handling
If traces are incomplete, stop and collect better traces. If provider accounting fields are unavailable, report component stability separately and do not claim monetary savings.

## Stop conditions
Stop after two failed optimization hypotheses, on any correctness/security regression, or when the measured improvement is below the team's materiality threshold.
