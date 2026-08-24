# Workflow — Secure Plan Transition

## Trigger
Plan exit, resume/relaunch, reconnect, failed clarification, context clear, or first privileged action after planning.

## Goal
Ensure capability increases occur only from a durable approval bound to the exact plan.

## Inputs
Plan file/hash, transition ledger, runtime mode, approval status, session epoch.

## Baseline
Record current rates of transition mismatches, missing approvals, stale hashes, and recovery-path mode changes.

## Context
Use `rules/transition.rules.md` and `skills/transition-verification.md`.

## Stages
1. Observe current plan, mode, approval, and epoch.
2. Measure baseline transition integrity.
3. Diagnose the first state divergence.
4. Form one concrete hypothesis about persistence, ordering, resume reconstruction, or error handling.
5. Implement the smallest safe fix without weakening the write barrier.
6. Re-measure using approved and hostile/error fixtures.
7. Independently verify resume/relaunch and first-write behavior.

## Responsible agent
Implementation owner for the fix; `subagents/transition-verifier.md` for final verification.

## Tools
Hashing, structured ledger inspection, `scripts/transition_guard.py`, tests.

## Outputs
Before/after transition metrics, defect classification, verification record.

## Checkpoints
- Before mode change: accepted approval exists.
- After resume: ledger is revalidated.
- Before first write/execute: guard passes again.

## Metrics
Unauthorized transitions blocked, binding success rate, resume mismatch count, false-block rate.

## Retry policy
Maximum 2 diagnose→fix→retest cycles. A third failure escalates and leaves the session in planning/read-only mode.

## Stop conditions
Stop on any invalid or missing approval. Complete only when approved transition passes and all negative fixtures fail closed.

## Failure path
Preserve plan/ledger evidence, force planning/read-only mode, surface the blocking invariant, escalate after two failed repair cycles.

## Verification
Independent fixture replay plus exact plan-hash and approval-ID comparison.

## Definition of Done
Evidence documented, baseline measured, limitation/root cause identified, transition guard integrated, tests pass, resume path tested, independent verification complete, no unauthorized capability increase remains.
