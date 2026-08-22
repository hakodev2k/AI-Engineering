# Workflow: Diagnose and Verify Terminal Finalization

## Trigger
Terminal/session/guardrail change or parity regression.

## Goal
Restore one observable finalization contract across all supported terminal paths.

## Inputs
Fixture matrix, baseline snapshots, implementation under test.

## Baseline
Capture current visible result and durable session items for every supported fixture before changing code.

## Stages
1. Observe failing path and preserve raw evidence.
2. Measure baseline parity and orphan counts.
3. Diagnose the first finalization-stage divergence.
4. Form one explicit hypothesis linking code branch to durable-state mismatch.
5. Implement the minimum fix.
6. Measure the full matrix again.
7. If not improved, re-evaluate once; maximum two implementation attempts.
8. Run independent verification from clean sessions.

## Responsible agent
Implementation owner for stages 3–6; Session Integrity Reviewer for stage 8.

## Tools
Framework tests, session inspector, `scripts/finalization_guard.py`.

## Outputs
Before/after matrix, violation report, implementation status, verification status.

## Checkpoints
Baseline captured; hypothesis evidence recorded; all fixtures rerun; independent verification complete.

## Metrics
Fixture pass rate, rejected-persistence count, orphan count, duplicate terminal-record count.

## Retry policy
At most two repair attempts. Test reruns do not change expected policy.

## Stop conditions
Verified zero blocking violations, or two failed repair attempts with escalation.

## Failure path
Revert/isolate the affected runner path, retain evidence, and block release where durable state can violate the guardrail contract.

## Definition of Done
Evidence documented; baseline captured; fix implemented; full matrix passes; no orphan/duplicate terminal records; independent verification passes; residual risks documented.
