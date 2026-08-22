# Workflow: Execute → Verify → Finalize

## Trigger
Any multi-step task with explicit deliverable and acceptance criteria.

## Goal
Prevent premature termination and goal substitution.

## Baseline
Capture goal, required rows, current statuses, deliverable existence, and verification coverage.

## Stages
1. Observe and create ledger.
2. Measure baseline acceptance coverage.
3. Diagnose open rows and dependencies.
4. Form bounded implementation hypothesis.
5. Implement only work mapped to open rows.
6. Measure again and attach evidence.
7. Acceptance Verifier independently reviews required rows.
8. Run finalization gate.
9. Complete only when all required rows are verified.

## Checkpoints
After corrections invalidate dependents; after subagent handoff reconcile criterion IDs; before final response validate ledger.

## Metrics
Verified coverage, premature-finalization blocks, stale-evidence detections, rework rate, unresolved-row preservation.

## Retry policy
Maximum two retries for the same failed hypothesis. A third attempt requires a different diagnosis or escalation.

## Stop conditions
All required rows verified, or a real blocker is documented and further safe progress is impossible.

## Failure path
Keep unresolved rows visible, record exact evidence, checkpoint state, and return incomplete/blocked rather than success.

## Definition of Done
Requested deliverable exists, all required rows are verified with current evidence, independent verification is complete where required, and finalization gate passes.