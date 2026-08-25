# Workflow — Inspect and Gate Approval Context

## Trigger
A tool call requires approval or crosses a configured sensitive-action boundary.

## Goal
Ensure approval is bound to the exact executable payload.

## Inputs
Source action, display action, risk class, optional approval binding.

## Baseline
Measure how many current permission prompts omit arguments, use summaries only, or cannot reproduce executable payload hashes.

## Stages
1. Observe: capture source/display envelopes without executing.
2. Measure baseline: classify disclosure completeness and parse status.
3. Diagnose: locate loss at serialization, normalization, transport, or rendering.
4. Form hypothesis: state the boundary causing mismatch.
5. Implement improvement in the host adapter/UI.
6. Measure again by rerunning the guard.
7. Independent verification by `subagents/approval-security-reviewer.md`.
8. Complete only after a passing verdict.

## Responsible agent
Integration owner for stages 1–6; independent Approval Security Reviewer for stage 7.

## Tools
Python 3 standard library, redacted client logs, unit tests.

## Outputs
Guard verdict JSON, before/after metrics, verification record.

## Checkpoints
Source captured; display captured; parse status explicit; canonical hashes compared; approval binding checked.

## Metrics
Missing-disclosure rate, mismatch rate, defaulted-input blocks, test pass rate.

## Retry policy
One retry after rebuilding malformed/incomplete transport data. Security mismatches are never automatically retried.

## Stop conditions
Maximum 2 attempts. Stop immediately on persistent mismatch, unknown executable payload, or missing sensitive arguments.

## Failure path
Block execution, retain redacted evidence, escalate to integration owner. Do not weaken disclosure requirements.

## Verification
`python -m unittest tests/test_approval_context_guard.py`

## Definition of Done
Implemented: guard runs before approval and before execution. Measured: baseline/after metrics exist. Verified: tests pass and independent review confirms sensitive mismatches are blocked.
