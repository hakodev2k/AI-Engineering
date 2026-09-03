# Skill: Interruption Recovery

## Purpose
Recover an interrupted child-agent execution without discarding verified work or replaying uncertain external effects.

## Trigger
Quota/rate-limit exhaustion, worker loss, process restart, cancelled child, or workflow resume.

## Inputs
Original task identifier; current input fingerprint; child checkpoint; side-effect ledger; retry history; policy.

## Preconditions
Checkpoint storage is readable; external write tools have stable operation identifiers where possible; recovery does not require weakening permissions.

## Required context
Facts about interruption time and cause; last verified phase; artifacts already produced; tool calls with known/unknown outcomes; current repository/external-state identity.

## Allowed tools
Read-only repository/state inspection, checkpoint store, logs, idempotency/status APIs, tests, and policy validator. Write tools only after resume is approved.

## Constraints
Do not infer success from a missing response. Do not replay non-idempotent writes with unknown outcome. Do not mark a child complete because the parent resumed successfully.

## Procedure
1. Record Facts, Assumptions, Evidence, Unknowns.
2. Fingerprint current task inputs and compare with checkpoint fingerprint.
3. Reconcile every side-effect ledger entry into `confirmed_success`, `confirmed_failure`, or `unknown`.
4. Run `check_resume_contract.py`.
5. If blocked, collect missing evidence once; do not repeatedly retry the same unresolved state.
6. If allowed, resume from `last_verified_phase`, not from the beginning.
7. After resume, compare output artifacts and effect ledger against the checkpoint.
8. Send result to independent Recovery Verifier.

## Decision points
- Fingerprint mismatch: BLOCK and re-plan.
- Unknown non-idempotent effect: BLOCK and reconcile or request human approval.
- Retry count >= policy maximum: STOP and escalate.
- Verifier unavailable for write-capable task: BLOCK completion.

## Expected output
Resume decision, safe phase, reconciled ledger, recovery metrics, verification handoff.

## Metrics
Recovered-work ratio, repeated calls, duplicate effects, recovery latency, retry count.

## Verification
Independent verifier confirms no completed effect was replayed and all required terminal outputs exist.

## Failure handling
One evidence-refresh attempt per blocked reason; maximum two automated resume attempts total.

## Stop conditions
Verified completion; unrecoverable input drift; unresolved unknown effect; retry budget exhausted; human approval required.
