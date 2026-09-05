# Skill: Compaction Continuity Analysis

## Purpose
Diagnose whether context compaction preserves the observable execution contract of a long-running agent task.

## Trigger
Any compaction-related stop, re-plan loop, false success, lost subagent result/handle, or scheduled run that produces no deliverable.

## Inputs
Pre/post-compaction traces; task objective; acceptance criteria; pending steps; tool/subagent handles; terminal status; compaction summary.

## Preconditions
Access to logs/state snapshots. Do not request hidden reasoning.

## Required context
Original task instruction, runtime mode (autonomous/interactive), and observable task state before compaction.

## Allowed tools
Read-only logs, state files, trace analyzers, checkpoint validator, tests.

## Constraints
Never store secrets in checkpoints. Never infer completion from a model's assertion alone.

## Procedure
1. Capture facts: active objective, completed criteria, pending criteria, external handles, last verified progress.
2. Record assumptions separately and mark evidence gaps.
3. Compare pre/post state field by field.
4. Test three hypotheses: goal omitted, goal misclassified as historical/completed, or execution handle lost.
5. Validate a reconstructed checkpoint with `scripts/validate_checkpoint.py`.
6. Replay the compaction boundary on a fixture.
7. Measure whether autonomous continuation occurs without a new user message.
8. Hand evidence to Continuity Verifier.

## Decision points
Missing active goal, criteria, or status => block. Autonomous + pending work + post-compaction stop => continuity failure. Completed criteria with evidence => legitimate termination.

## Expected output
Facts, assumptions, evidence, hypotheses, root cause, checkpoint diff, verification status.

## Metrics
Fields preserved; pending steps lost; false-success count; tool calls/time to recover; completion rate after resume.

## Verification
Reproduction fails before fix and passes after fix under the same fixture.

## Failure handling
Retry trace reconstruction once; a second ambiguity becomes BLOCKED, not SUCCESS.

## Stop conditions
Stop after two reconstruction attempts or when required state cannot be established from evidence.