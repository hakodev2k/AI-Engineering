# Workflow — Calibrate and Verify Compaction

## Trigger
New model/provider route, changed context metadata, high token cost, prompt-too-long failures, or late/early compaction symptoms.

## Goal
Set and verify a safe compaction trigger from measured effective capacity.

## Inputs
Calibration JSON, policy JSON, baseline telemetry, representative task suite.

## Baseline
Capture tokens/task, utilization at compaction, latency/task, cost/task, compaction failures, and task-quality results before changing policy.

## Stages
1. Observe current raw/effective/provider limits and threshold behavior.
2. Measure baseline on representative tasks without policy change.
3. Diagnose late trigger, early trigger, accounting drift, or route mismatch.
4. Form a falsifiable threshold hypothesis.
5. Run `scripts/context_calibrator.py`.
6. Implement the candidate in the host runtime.
7. Measure again on the same task suite.
8. If not improved, try at most two additional candidates with changed hypotheses.
9. Independent verification by Context Budget Analyst.
10. Retain only a threshold satisfying budget and quality gates.

## Responsible agent
Runtime owner for implementation; Context Budget Analyst for final review.

## Tools
Python 3, provider telemetry, task benchmark harness.

## Outputs
Calibration report, before/after metrics, selected threshold, verification record.

## Checkpoints
Metadata source identified; effective window computed; runway preserved; baseline recorded; candidate tested; quality regression checked.

## Metrics
Tokens/task, cost/task, latency/task, failure rate, compactions/task, utilization at compaction, quality pass rate.

## Retry policy
Maximum three candidate thresholds total. Every retry must change a stated hypothesis or input.

## Stop conditions
Stop on unresolved provider-limit uncertainty, repeated compaction failure after three candidates, or critical correctness/security regression.

## Failure path
Restore the last verified threshold, preserve evidence, and escalate. Do not increase context limits blindly.

## Verification
`python -m unittest tests/test_context_calibrator.py` plus representative before/after tasks.

## Definition of Done
Implemented: host uses a threshold derived from effective capacity/runway. Measured: before/after metrics exist. Verified: deterministic tests pass and independent review confirms no critical regression.
