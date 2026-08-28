# Workflow: Measure, Diagnose and Optimize

**Trigger:** cache-hit regression, token-cost increase, latency increase, model/provider change, or prompt-assembly change.  
**Goal:** reduce fresh repeated input-token work without losing required context.

## Inputs
Representative multi-turn workload, sanitized usage traces, provider/model cache requirements, thresholds and request-construction code.

## Baseline
Capture at least four calls where practical and record session id, reusable-prefix hash, provider, input tokens, cached tokens, total task result and quality checks.

## Stages
1. **Observe** current cache/session behavior.
2. **Measure baseline** with `scripts/cache_affinity_profiler.py`.
3. **Diagnose** session-id drift, prefix drift, provider failover, TTL/eligibility, or missing explicit cache controls.
4. **Form hypothesis** linking one root cause to observed cold-cache behavior.
5. **Implement improvement** while preserving required context and security instructions.
6. **Measure again** on the same workload.
7. If not improved, revise the hypothesis; maximum 2 retries.
8. **Verify** independently using `subagents/token-verifier.md`.

## Responsible agent
Implementation owner for diagnosis/change; independent token verifier for final acceptance.

## Tools
Provider docs, request/usage telemetry, source inspection, profiler and unit tests.

## Outputs
Baseline metrics, hypothesis, change, candidate metrics, comparison, quality/security verification status.

## Checkpoints
After baseline; before changing prompt content; after candidate measurement; before release.

## Metrics
Fresh input tokens/task, cache-hit ratio, cached-token share, provider changes, cold streak, tokens/task, latency/task where available, result-quality regression rate.

## Retry policy
Maximum 2 hypothesis revisions.

## Stop conditions
Required context removed, quality/security regression, missing reliable telemetry, or exhausted retries.

## Failure path
Revert the optimization, preserve correctness, document unsupported model/provider behavior and escalate if costs remain material.

## Verification
Same workload and required context; independent reviewer confirms measured reuse rather than inferred configuration success.

## Definition of Done
Baseline and candidate captured, root cause supported by evidence, fresh repeated input reduced or cache reuse improved, quality/security preserved, independent verification passed.
