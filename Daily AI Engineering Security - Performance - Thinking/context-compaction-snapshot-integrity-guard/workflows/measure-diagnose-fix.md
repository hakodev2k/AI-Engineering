# Workflow: Measure, Diagnose, Fix

## Trigger
Unexpected early/repeated compaction, token-budget rejection, or context-capacity configuration change.

## Goal
Identify and repair token-accounting defects without sacrificing required task context.

## Inputs
Token traces, runtime configuration, counter producers, policy, regression fixtures.

## Baseline
Record current prompt tokens, cumulative usage, configured/effective capacities, reserve, compaction count, latency, and task-quality result for at least three representative runs.

## Stages
1. **Observe:** capture the exact compaction/precheck decision trace.
2. **Measure baseline:** run the guard without changing configuration.
3. **Diagnose:** map each counter to source and semantic scope.
4. **Form hypothesis:** explain one observed violation with one testable accounting cause.
5. **Implement improvement:** change only the counter/capacity path needed to restore the invariant.
6. **Measure again:** replay the same fixtures.
7. **Improved?** If no, revise the hypothesis; maximum two revisions.
8. **Verify:** hand off to `subagents/accounting-verifier.md`.

## Responsible agent
Implementation owner for stages 1–7; Accounting Verifier for stage 8.

## Tools
Guard script, unit tests, provider/runtime logs, code diff.

## Outputs
Baseline JSON, hypothesis record, implementation diff, after-measurements, verification decision.

## Checkpoints
After baseline, before code change, after after-measurement, before release.

## Metrics
Utilization at compaction, compactions/100 turns, mismatches/run, tokens/task, latency/task, quality regression.

## Retry policy
Maximum two hypothesis revisions and one implementation correction per hypothesis.

## Stop conditions
Stop on state-loss risk, unavailable live token source, unresolved capacity split-brain, or exhausted retries.

## Failure path
Disable the affected automatic-compaction path where operationally safe and escalate with traces; do not lower correctness/security requirements.

## Verification
Independent verifier reproduces expected defer/allow/block decisions.

## Definition of Done
Baseline captured; root cause evidenced; fix implemented; metrics re-measured; tests pass; independent verification passes; no blocking accounting inconsistency remains.
