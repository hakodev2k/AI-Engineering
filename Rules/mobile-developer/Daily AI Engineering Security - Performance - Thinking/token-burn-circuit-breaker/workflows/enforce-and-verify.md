# Workflow: Enforce and Verify Token Budgets

## Trigger
New autonomous workflow, token-burn incident, or material orchestration change.

## Goal
Measure baseline usage, enforce hierarchical budgets, then demonstrate reduced runaway risk without critical quality loss.

## Inputs
Representative tasks, usage telemetry, policy config, acceptance criteria.

## Baseline
Run at least three representative tasks when feasible and record tokens/task, retries, subagent usage, cost, latency, and acceptance result. Preserve the raw sanitized ledger.

## Stages
1. **Observe** — collect usage and progress events without changing behavior.
2. **Measure** — calculate total/retry/no-progress usage and source attribution.
3. **Diagnose** — identify the dominant burn path and whether it is productive, repetitive, or telemetry error.
4. **Hypothesize** — state the exact threshold or lineage rule expected to stop the failure.
5. **Implement** — place the pre-call/post-call guard in every model-call path and reserve child budgets.
6. **Measure again** — replay representative and runaway fixtures.
7. **Verify independently** — Budget Verifier checks decisions and quality.

## Responsible agent
Implementation owner for stages 1–6; `subagents/budget-verifier.md` for stage 7.

## Tools
Usage export/logging, `scripts/budget_guard.py`, project test runner.

## Outputs
Baseline metrics, configured policy, before/after metrics, stop evidence, independent verification record.

## Checkpoints
- C1 telemetry covers every model-call path.
- C2 baseline accepted.
- C3 hard-cap fixture stops.
- C4 representative tasks still meet acceptance criteria.

## Metrics
Tokens/task, estimated cost, retry ratio, no-progress tokens, token velocity, completion rate, regression rate.

## Retry policy
At most two policy/implementation revisions after the first measured attempt. Each revision must change a documented hypothesis; identical retries are prohibited.

## Stop conditions
Stop successfully after C1–C4 pass. Stop unsuccessfully after two revisions, missing trustworthy telemetry, or a critical quality/security regression.

## Failure path
Retain previous safe behavior, disable unattended mode for the affected path, preserve evidence, and escalate for human review. Do not weaken security or correctness to satisfy the budget.

## Definition of Done
Implemented: all model paths use the guard. Measured: before/after metrics exist. Verified: independent tests prove runaway fixtures stop and accepted baseline tasks remain acceptable.
