# Skill: Cache Affinity Investigation

## Purpose
Diagnose silent prompt-cache regressions in multi-turn OpenRouter agent workflows using measured usage traces rather than configuration assumptions.

## Trigger
Higher input-token cost, latency increase, low `cached_tokens`, provider-routing changes, model upgrades, or prompt-assembly changes.

## Inputs
Per-call session id, reusable-prefix hash, provider id, input tokens, cached tokens, model, timing, and optional baseline trace.

## Preconditions
Use a representative multi-turn task with enough repeated prefix tokens to be cache-eligible for the selected provider/model.

## Required context
Current OpenRouter caching/sticky-routing documentation, provider/model cache requirements, and the agent request-construction path.

## Allowed tools
Usage/API telemetry, request dumps with secrets removed, source inspection, `scripts/cache_affinity_profiler.py`.

## Constraints
MUST NOT claim improvement from configuration presence alone. MUST NOT delete correctness-critical context solely to improve cache metrics. MUST redact authorization headers and secrets.

## Procedure
1. Capture a baseline trace across at least four calls where practical.
2. Verify whether one logical task uses a stable `session_id`.
3. Compute a stable hash of the intended reusable prefix after removing secrets.
4. Record provider endpoint identity where available and identify legitimate failovers.
5. Measure cache-hit ratio, cached-token share, fresh input tokens and cold streaks.
6. Form hypotheses in order: session-id drift, prefix drift, provider failover, cache ineligibility/TTL, missing explicit cache controls.
7. Change one variable at a time.
8. Re-run the identical workload and compare before/after.
9. Require independent verification before declaring the regression fixed.

## Decision points
Escalate if session identity is stable but cache reads remain absent, because provider/model eligibility or request-shape behavior requires deeper investigation.

## Expected output
Facts, assumptions, evidence, hypotheses, selected change, before/after metrics, risks, verification status.

## Metrics
Tokens/task, fresh input tokens/task, cache-hit ratio, cached-token share, provider changes, latency/task where available, result-quality regression rate.

## Verification
Same workload, same required context and same quality checks; improvement must be measured in fresh input tokens/cache reuse without correctness loss.

## Failure handling
Maximum 2 hypothesis revisions. Fallback: preserve correctness and disable the optimization gate for the unsupported provider/model with a documented exception rather than stripping context.

## Stop conditions
Stop on exhausted retries, missing reliable telemetry, or any quality/security regression caused by context removal.
