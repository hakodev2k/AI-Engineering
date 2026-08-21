# Workflow: Plan to Execution

## Trigger
A plan is approved, or the watchdog detects repeated planning/review without a deliverable delta.

## Goal
Transition from planning to implementation/verification without infinite meta-work.

## Inputs
Goal, acceptance gates, approved plan version, event log, repository/artifact state.

## Baseline
Capture current changed files/artifacts, tests passing, current phase, plan hash, and meta-only streak.

## Stages
1. **Observe** — Progress Auditor classifies recent actions and records facts/evidence.
2. **Measure baseline** — Run `scripts/progress_watchdog.py events.json --config config/watchdog.json`.
3. **Diagnose** — Determine whether the task lacks requirements, has a real blocker, or is simply repeating meta-work.
4. **Hypothesis** — Select the smallest implementation or verification action that creates measurable product evidence.
5. **Implement** — Execute only approved changes; dangerous actions still require human approval.
6. **Measure again** — Add events and rerun the watchdog.
7. **Improved?** — If no deliverable delta, allow at most 2 recovery attempts; do not regenerate the same plan unless inputs changed.
8. **Verify** — Verification Agent evaluates all acceptance gates.
9. **Complete or block** — Complete only with all gates passing; otherwise report exact blocker.

## Responsible agents
Progress Auditor for stages 1–3; implementation agent for 4–6; Verification Agent for 8–9.

## Tools
Repository diff/status, tests, event log, watchdog script.

## Outputs
Progress decision, deliverable delta, verification evidence, completion/block status.

## Checkpoints
After plan approval, after each recovery attempt, and immediately before completion.

## Metrics
Meta-only streak, plan regenerations, product deltas, acceptance pass rate, retries.

## Retry policy
Maximum 2 recovery attempts after a no-progress decision.

## Stop conditions
All gates pass; a human decision is required; instruction conflict persists; or retry budget is exhausted.

## Failure path
Preserve evidence and current state, report the blocker, and stop autonomous meta-work.

## Definition of Done
At least one required deliverable exists, all acceptance gates pass, verification is independent where required, and watchdog decision is `complete_allowed`.
