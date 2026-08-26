# Workflow: Baseline, Diagnose, Integrate

## Trigger
Runaway-agent incident or planned autonomous-loop rollout.

## Goal
Measure current failure tails, define observable progress, integrate terminal ownership, and re-measure.

## Inputs
Successful and failed traces, task acceptance criteria, current retry/time/token configuration, guard policy.

## Baseline
For each task class, measure turns, tokens, wall time, repeated-equivalent failures, durable artifacts, and completion outcome. Include at least one known transient failure and one known runaway case.

## Context
Use event logs and durable task state; do not inspect hidden chain-of-thought.

## Stages
1. **Observe:** identify repeated tool/result sequences and the first point where durable progress stopped.
2. **Measure baseline:** record median/p95 cost and zero-progress tail.
3. **Diagnose:** determine whether the current detector lacks equivalence normalization, progress markers, hard budgets, or terminal ownership.
4. **Form hypothesis:** define one falsifiable runtime change.
5. **Implement improvement:** wire the external guard after tool results and before the next model turn.
6. **Measure again:** replay the exact traces and benchmark set.
7. **Improved?** If no, revise at most twice.
8. **Verify:** hand off to the independent Progress Verifier.

## Responsible agent
Runtime implementer for stages 1–7; Progress Verifier for stage 8.

## Tools
Structured trace parser, guard script, unit tests, repository diff/test tooling.

## Outputs
Baseline report, progress-marker definition, policy, implementation diff, replay metrics, verification result.

## Checkpoints
After baseline; after marker definition; before enabling terminal action; after replay.

## Metrics
Zero-progress turns, tokens/time after first repeat, false-stop rate, durable artifact rate, median/p95 cost per completion.

## Retry policy
Maximum two hypothesis revisions and one corrective implementation pass per revision.

## Stop conditions
Stop immediately on irreversible-action risk, missing terminal ownership, unavailable checkpoint path for required artifacts, or exhausted retries.

## Failure path
Keep hard budgets enabled, disable autonomous continuation for the affected task class, preserve trace evidence, and escalate.

## Verification
Independent replay must include both legitimate transient recovery and confirmed zero-progress loops.

## Definition of Done
Baseline measured, root cause evidenced, terminal owner integrated, metrics improved without unacceptable false stops, tests pass, independent verification passes.
