# Workflow: Diagnose and Implement
## Trigger
Compaction-related lost state, duplicate side effects, or planned runtime change.
## Goal
Create a measurable quiescence boundary around compaction.
## Inputs
Incident timeline, ledger/events, token thresholds, tool executor behavior.
## Baseline
Count unresolved mutations at compaction and lost/duplicate-effect incidents over a representative run set.
## Context
Use observable state only.
## Stages
1. Observe compaction and tool lifecycle events.
2. Measure baseline.
3. Diagnose the exact state gap.
4. Form one testable hypothesis.
5. Implement ledger/fence integration.
6. Measure again.
7. If not improved, revise hypothesis once.
8. Run independent verification.
## Responsible agent
Runtime implementer; Verification Agent for final pass.
## Tools
Tests, logs, read-only external state queries.
## Outputs
Before/after metrics, implementation diff, verification record.
## Checkpoints
Before mutation, before compaction, after external confirmation.
## Metrics
Unresolved mutations at compaction; confirmation ratio; duplicates; lost effects.
## Retry policy
Maximum 1 implementation revision.
## Stop conditions
Irreversible uncertainty, duplicate side effect, missing evidence, or failed second measurement.
## Failure path
Disable automatic compaction for affected path and escalate.
## Verification
Separate verifier reproduces blocking fixtures.
## Definition of Done
Baseline exists, fence integrated, measurements improved, tests pass, no blocking issue remains.
