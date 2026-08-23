# Workflow: Measure → Fix → Verify

## Trigger
Suspected premature/repeated compaction.

## Goal
Remove semantic token-accounting errors without suppressing legitimate compaction.

## Inputs
Session trace, per-call usage, runtime configuration, source revision.

## Baseline
Measure real current occupancy, decision occupancy, compactions/hour, summary tokens, and divergence ratio.

## Stages
1. **Observe** — capture an affected trace.
2. **Measure** — identify exact threshold input.
3. **Diagnose** — classify token source and freshness.
4. **Hypothesis** — compaction consumes non-context or stale usage.
5. **Implement** — insert the source-of-truth gate at the decision boundary.
6. **Measure again** — replay identical fixtures.
7. **Verify** — independent Token Verifier checks both false-positive and true-positive cases.

## Responsible agent
Runtime implementer for stage 5; Token Verifier for stage 7.

## Tools
Logs, tests, `scripts/compaction_guard.py`.

## Outputs
Baseline report, patched decision contract, regression results.

## Checkpoints
Do not implement before baseline. Do not release before independent verification.

## Metrics
False-compaction rate, true-compaction recall, compactions/hour, summary tokens/task, quality regression.

## Retry policy
Maximum two implementation iterations. Each retry requires a new failing fixture or falsified hypothesis.

## Stop conditions
Stop on passing verification or after two failed iterations and escalate.

## Failure path
Preserve context, disable only automatic compaction for the affected path if operationally safe, and require explicit operator action; never lower quality/context to hide the bug.

## Definition of Done
Measured baseline and after-state, invariant enforced, tests pass, no critical context loss, verifier approves.