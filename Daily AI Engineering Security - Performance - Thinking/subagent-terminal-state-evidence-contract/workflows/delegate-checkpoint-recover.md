# Workflow: Delegate, Checkpoint, Recover

## Trigger
A task is delegated to a subagent.

## Goal
Prevent false success and preserve partial work across terminal/runtime failures.

## Inputs
Task acceptance criteria, expected deliverables, verification requirements.

## Baseline
Measure historical false-success rate, empty completions, reruns, and rework cost where traces exist.

## Stages
1. Define acceptance criteria and expected artifacts.
2. Delegate bounded scope with checkpoint requirements.
3. Checkpoint durable artifacts at meaningful milestones.
4. Return completion envelope: terminal reason, result, deliverables, unresolved actions, verification.
5. Run deterministic validator.
6. If valid, independent verifier checks evidence.
7. If incomplete, recover from checkpoint once; if still incomplete, retry child once.
8. Stop and escalate after bounded attempts.

## Responsible agent
Child implementer, parent orchestrator, Independent Completion Verifier.

## Tools
Completion validator plus artifact/test inspection.

## Outputs
Validated completion envelope and verification decision.

## Checkpoints
Before expensive tool batches, after durable artifact creation, before final response.

## Metrics
False-success rate, checkpoint recovery rate, child reruns, rework tokens/time, verification coverage.

## Retry policy
Maximum one checkpoint recovery and one fresh child retry.

## Stop conditions
Missing required evidence after retry, dangerous unresolved action, or non-recoverable artifact failure.

## Failure path
Return explicit `incomplete` with evidence instead of fabricating success.

## Verification
Independent verifier must confirm artifact existence and required checks for high-impact tasks.

## Definition of Done
Completion validator passes and independent verification passes when required.
