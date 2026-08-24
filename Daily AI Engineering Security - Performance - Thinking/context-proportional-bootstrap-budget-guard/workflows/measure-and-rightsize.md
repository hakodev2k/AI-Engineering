# Workflow: Measure and Rightsize

## Trigger
Bootstrap/context ratio exceeds policy, or model/capability configuration changes.

## Goal
Reduce bootstrap context to policy limits while preserving required context and task quality.

## Inputs
Context window, manifest, policy, representative eval set.

## Baseline
Record total bootstrap tokens, per-kind tokens, tools/skills loaded, latency and eval quality.

## Stages
1. **Observe** — collect real component/token inventory.
2. **Measure baseline** — run `scripts/bootstrap_budget.py`.
3. **Diagnose** — identify optional high-token components and duplicated/static payload.
4. **Hypothesize** — select one bounded pruning/defer strategy.
5. **Implement** — change selection/loading policy, not mandatory semantics.
6. **Measure again** — rerun analyzer and eval.
7. **Improved?** — if no, revise once; maximum two total adjustment iterations.
8. **Verify** — independent Context Budget Reviewer reruns checks.

## Responsible agent
Implementation owner for stages 1–6; Context Budget Reviewer for stage 8.

## Tools
Tokenizer telemetry, analyzer script, eval runner.

## Outputs
Baseline report, candidate report, quality comparison, reviewer decision.

## Checkpoints
Before pruning; after each iteration; before acceptance.

## Metrics
Bootstrap ratio, free task tokens, output reserve, evicted optional tokens, quality regression, latency.

## Retry policy
At most two adjustment iterations. Each retry MUST change the hypothesis based on measured evidence.

## Stop conditions
Pass + verified; two failed iterations; required-only payload exceeds cap; or quality threshold violated with no safe alternative.

## Failure path
Restore last known-good manifest, record evidence, escalate model/capability redesign.

## Definition of Done
Analyzer passes, required context retained, quality within tolerance, reviewer verifies evidence.