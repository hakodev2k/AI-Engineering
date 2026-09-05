# Workflow: Diagnose and Recover from Successful Tool Loops

## Trigger
Detector block, token/time anomaly, recursion-limit event, or human loop report.

## Goal
Stop non-progress early, identify root cause, recover with bounded strategy changes, and verify task evidence.

## Inputs
Tool JSONL trace, task/subgoal, progress definition, baseline metrics.

## Baseline
Calls and tokens since last progress, elapsed time, repeated signature count, current completion evidence.

## Stages
1. Observe trace and measure baseline.
2. Diagnose repeated signature and last progress point.
3. Form explicit root-cause hypothesis from evidence.
4. Recovery 1: change query/tool/target/hypothesis and run bounded segment.
5. Measure again. If progress advanced, verify.
6. If not, Recovery 2: change a different dimension or decompose/escalate.
7. Measure again. If no progress, stop.
8. Independent Progress Verifier checks completion evidence.

## Responsible agent
Investigator/implementation agent for stages 1-7; Progress Verifier for stage 8.

## Tools
Trace analyzer, `scripts/progress_loop_guard.py`, task-specific safe tools, tests.

## Outputs
Baseline, loop signature, hypotheses, recovery log, before/after metrics, verifier decision.

## Checkpoints
Every recovery must state what observable dimension changed and what evidence would falsify the hypothesis.

## Metrics
Calls/tokens/time without progress, detection latency, recovery success, verification coverage, false positives.

## Retry policy
Exactly two maximum recovery attempts.

## Stop conditions
No progress after recovery 2; missing required evidence; unsafe action requires ungranted approval.

## Failure path
Terminate stalled subgoal safely, preserve evidence, report blocker and unresolved assumptions.

## Verification
Replay detector plus independent check of final completion criteria.

## Definition of Done
Loop is bounded; progress evidence exists; unsupported conclusions removed; verification complete.