# Skill: Subagent Fan-out Cost Analysis

## Purpose
Measure whether proposed parallel subagents justify their repeated fixed context cost.

## Trigger
Before spawning subagents, after a material context-size change, or when cumulative session usage crosses 50%, 75%, or 90% of budget.

## Inputs
Historical bootstrap-token samples, proposed child tasks, inherited-context estimates, useful-work estimates, current session usage, policy.

## Preconditions
At least token accounting from recent runs or an explicit conservative fallback baseline.

## Required context
Task requirements and usage telemetry only; correctness-critical context is never removed merely to save tokens.

## Allowed tools
Usage logs, token accounting APIs, `scripts/fanout_budget_guard.py`, benchmark results.

## Constraints
MUST measure a baseline before claiming savings. MUST NOT reduce security, verification, or required task context to meet a budget.

## Procedure
1. Collect recent child bootstrap-token measurements.
2. Use median measured bootstrap as the baseline; record when fallback is used.
3. Estimate inherited context and useful work for each proposed child.
4. Run the deterministic fan-out gate.
5. If recommendation is `serial`, keep tiny related work in the parent.
6. If `group`, combine low-value related children while preserving role separation needed for independent verification.
7. If `fanout`, spawn only admitted children and record actual tokens.
8. Reconcile projected vs actual usage after completion.
9. Re-run admission before retries or additional fan-out.

## Decision points
Block when remaining cumulative budget cannot cover conservative worst-case cost; prefer serial/grouped topology when useful-work-to-bootstrap ratio is below policy.

## Expected output
Baseline, projections, topology decision, reason codes, actual-vs-projected comparison.

## Metrics
Tokens/task, bootstrap tokens/child, useful-work ratio, cumulative tokens, cost/task, latency/task, quality/regression rate.

## Verification
Compare at least one representative fan-out task against serial/grouped execution with equivalent correctness checks.

## Failure handling
Fail closed on missing budget state; use conservative fallback bootstrap; escalate if required independent verification cannot fit budget.

## Stop conditions
Maximum two topology revisions per task. Stop spawning when budget reserve would be violated.
