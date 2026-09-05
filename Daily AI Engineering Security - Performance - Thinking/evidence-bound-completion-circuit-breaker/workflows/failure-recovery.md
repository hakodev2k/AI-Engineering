# Workflow: Failure Recovery

## Trigger
Guard blocks completion, evidence remains unchanged, or retry/failure budget is reached.

## Goal
Recover through evidence-driven replan without infinite looping.

## Inputs
Latest evidence, failed hypotheses, counters, blockers.

## Baseline
Snapshot exact failed criteria and last evidence advancement.

## Stages
1. Detect whether failure is stale state, wrong target, implementation defect, environment blocker, or invalid criterion.
2. Refresh external state once.
3. Choose one materially different hypothesis/short path.
4. Execute one bounded remediation cycle.
5. Re-measure target evidence.
6. If no advancement, stop and escalate with evidence.

## Retry policy
One recovery cycle after initial implementation cycle; total maximum 2.

## Stop conditions
Requested readiness verified, or evidence does not advance after recovery, or unsafe action would be required.

## Failure path
Return BLOCKED with missing criteria and evidence; never convert to DONE.

## Definition of Done
Recovery either establishes verified readiness or produces an explicit, evidence-backed blocker state.