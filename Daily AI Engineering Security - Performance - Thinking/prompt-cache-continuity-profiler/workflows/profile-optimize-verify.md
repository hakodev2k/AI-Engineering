# Workflow — Profile, Optimize, Verify

## Trigger
Cache-hit, token-cost, or latency regression; prompt-template change; provider cache-control migration; MCP catalog stability change.

## Goal
Improve cache continuity with no critical context or quality loss.

## Inputs
Representative task fixtures, request profiles, cache policy, provider usage metadata.

## Baseline
Collect at least three comparable runs per fixture. Record input, cached-input, cache-write, output tokens, latency, cost if available, quality result, cache key/breakpoint metadata, and ordered segment fingerprints.

## Stages
1. **Observe** — capture profiles without raw sensitive content.
2. **Measure baseline** — calculate cache and quality metrics.
3. **Diagnose** — locate earliest prefix divergence; inspect key/TTL/model if no divergence exists.
4. **Form hypothesis** — choose exactly one stability improvement.
5. **Implement** — reorder/canonicalize/stabilize key/breakpoint or use cacheable catalog semantics.
6. **Measure again** — replay the same fixtures.
7. **Improved?** — compare policy thresholds and quality.
8. **Verify** — independent `subagents/cache-verifier.md` review.

## Responsible agent
Prompt/runtime implementer through stage 7; cache verifier for stage 8.

## Tools
`scripts/cache_profile.py`, existing token/cost telemetry, task-quality test suite.

## Outputs
Baseline/candidate profile comparison, divergence cause, selected change, risk record, verification status.

## Checkpoints
Baseline exists; cause classified; hypothesis recorded; candidate profiles collected; critical context test passed; verifier complete.

## Metrics
Cached-input ratio, cache-write tokens, uncached input tokens/task, cost/task, latency, stable-prefix ratio, divergence index, task quality, critical-context regressions.

## Retry policy
Maximum two hypothesis revisions. Each retry requires new evidence and a documented reason.

## Stop conditions
Verified improvement, two failed hypotheses, insufficient telemetry, or any security/correctness regression.

## Failure path
Restore prior prompt/config; preserve safe profiles; mark cause unresolved; escalate to platform owner.

## Definition of Done
Policy thresholds met, task quality non-regressed, critical context retained, cache boundaries safe, metrics independently reproduced, and status `Verified`.
