# Workflow: Audit and Score

## Trigger
Completion of a benchmark run with external retrieval enabled.

## Goal
Admit only contamination-clean, trace-complete runs to scoring.

## Inputs
Task policy, raw trace, candidate score, task version, fixture suite.

## Baseline
Measure external trace coverage and contamination rate on current harness before gating.

## Context
The workflow evaluates observable provenance, not hidden reasoning.

## Stages
1. Observe: inventory retrieval/search events.
2. Measure baseline: record coverage and current contamination matches.
3. Diagnose: identify missing event types and public answer surfaces.
4. Form hypothesis: define the smallest deterministic policy that catches seeded leakage.
5. Implement improvement: wire scanner into score admission.
6. Measure again: run contaminated and clean fixtures.
7. Improved? If false negatives or excessive false positives remain, revise policy up to two times.
8. Verify: independent verifier reproduces classification.
9. Complete: accept only clean traces.

## Responsible agent
Evaluation engineer for stages 1-7; Independent Evaluation Verifier for stage 8.

## Tools
Trace export, `scripts/scan_trace_contamination.py`, unit tests, benchmark metadata.

## Outputs
Classification, evidence matches, metrics, admitted score or quarantine record.

## Checkpoints
Trace completeness before classification; seeded fixture detection before rollout; independent verification before publication.

## Metrics
Seed detection rate, clean false-positive rate, trace coverage, indeterminate rate, score delta.

## Retry policy
Maximum 2 policy iterations; maximum 1 trace-export retry.

## Stop conditions
Unresolved telemetry gap, unbounded false-positive pattern, or contamination status indeterminate after retry.

## Failure path
Quarantine run, preserve trace evidence, escalate to benchmark owner, do not publish as clean.

## Verification
Verifier reruns scanner and confirms policy/version hashes plus blocking evidence.

## Definition of Done
Complete trace, deterministic classification, fixture tests pass, metrics recorded, independent verification complete, and only clean runs included in score.