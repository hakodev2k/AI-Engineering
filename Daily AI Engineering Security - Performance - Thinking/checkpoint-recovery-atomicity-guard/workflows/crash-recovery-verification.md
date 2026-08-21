# Workflow: Crash Recovery Verification

## Trigger
Agent process restart, cancellation recovery, or checkpoint resume after abnormal termination.

## Goal
Choose a recovery action only from durable evidence and prevent duplicate/missing side effects.

## Inputs
Checkpoint snapshot, pending-write snapshot, side-effect receipts, transition policy.

## Baseline
Record the current checkpoint ID/version, pending-write IDs, expected side effects, authoritative receipt states, and whether normal resume would replay any node.

## Context
Use observable facts only. No hidden chain-of-thought is required or stored.

## Stages
1. **Observe** — freeze read-only evidence references.
2. **Measure baseline** — run the consistency checker.
3. **Diagnose** — identify mismatch, unknown commit status, or clean state.
4. **Form hypothesis** — propose `replay`, `resume-without-replay`, or `block-for-reconciliation` and state the evidence required.
5. **Implement improvement** — add/fix transition correlation or transaction/outbox handling in the host application; do not mutate production during diagnosis.
6. **Measure again** — execute crash fixtures around each checkpoint boundary.
7. **Verify** — Recovery Verifier independently checks every scenario.
8. **Complete** — persist sanitized before/after metrics and residual risks.

## Responsible agent
Host implementation agent performs changes; `subagents/recovery-verifier.md` is the independent verifier.

## Tools
`scripts/recovery_consistency_check.py`, target application test harness, authoritative read-only status APIs.

## Outputs
Baseline report, recovery decision, test evidence, independent PASS/BLOCK.

## Checkpoints
No replay before evidence classification. No completion before forced-crash tests and independent verification.

## Metrics
Duplicate effects, missing effects, ambiguous decisions, mismatch count, crash-fixture success rate, recovery time.

## Retry policy
At most two evidence-collection retries for transient failures and at most two implementation/test cycles for the same root cause.

## Stop conditions
Stop on persistent ambiguity, irreversible action requirement, conflicting authoritative sources, or no measurable improvement after two implementation cycles.

## Failure path
Return `block-for-reconciliation`; preserve evidence; require a human-approved recovery/compensation action rather than weakening the invariant.

## Verification
For every crash point, verify exact expected side-effect cardinality and one coherent checkpoint/write transition.

## Definition of Done
Baseline exists; root cause documented; recovery invariant implemented; crash tests pass; no duplicate/missing effect occurs in fixtures; all recovery decisions are evidence-backed; independent verifier returns PASS.