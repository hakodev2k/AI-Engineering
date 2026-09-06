# Measure, Rearm, Verify Workflow

## Trigger
Max compression attempts during a long turn, plugin-context-engine integration, or suspected attempt-budget leakage.

## Goal
Keep failed/no-progress compression bounded while allowing long turns to continue across multiple independently successful maintenance compactions.

## Inputs
Context-engine config, attempt cap, threshold tokens, baseline trace, implementation trace, and test fixtures.

## Baseline
Capture attempts/turn, successful-progress compactions, failed/no-progress attempts, max-attempt terminations, prompt tokens, reclaimed tokens, compression latency, and task completion rate.

## Context
A successful compaction is not sufficient evidence by itself. Progress is verified only after reduction, threshold clearance, and a successful next request.

## Stages
1. **Observe** — capture ordered compression/request events.
2. **Measure baseline** — run the trace checker and record failure-budget behavior.
3. **Diagnose** — classify missed re-arm, unsafe re-arm, no-progress loop, or missing telemetry.
4. **Form hypothesis** — map the violation to budget semantics or private-engine coupling.
5. **Implement improvement** — normalize a public compaction result and re-arm only after verified progress.
6. **Measure again** — replay the same workload/fixtures.
7. **Improved?** — if no, re-evaluate at most 2 implementation iterations; if yes, proceed.
8. **Verify** — independent Context Budget Verifier validates traces and tests.

## Responsible agent
Implementation owner for changes; Context Budget Verifier for final verification.

## Tools
Runtime telemetry and `scripts/check_compaction_budget.py`.

## Outputs
Baseline/post-change metrics, violation report, verified state-machine behavior, and final status.

## Checkpoints
Before changing retry semantics, after each integration iteration, and before claiming completion.

## Metrics
0 unsafe re-arms; 0 missed re-arms in valid-progress fixtures; failure loops bounded by configured cap; reduced max-attempt terminations on representative long turns without increased context-loss regression.

## Retry policy
Maximum 2 implementation/measurement iterations. Trace recollection may retry once for instrumentation failure.

## Stop conditions
Verified improvement, 2 unsuccessful implementation iterations, or missing telemetry that prevents evidence-based verification.

## Failure path
Restore prior bounded behavior, preserve traces, keep the issue open, and escalate. Never disable the attempt cap or discard required context to hide failure.

## Verification
Run unit tests and compare baseline/post-change traces with the deterministic checker.

## Definition of Done
Implemented: public progress contract and bounded state machine integrated. Measured: before/after traces collected. Verified: valid progress re-arms, failures remain bounded, plugin engine does not depend on private built-in state, and quality/context regression checks pass.
