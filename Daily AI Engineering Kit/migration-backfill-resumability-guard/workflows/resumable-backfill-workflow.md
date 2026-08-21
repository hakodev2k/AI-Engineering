# Workflow: Migration Backfill Resumability Guard

## Trigger
A feature, repair, migration or incident task requires bulk data mutation or resuming a prior backfill.

## Entry conditions
Repository context is available; source/target identity is known; production write has not started without approval.

## Flow
```text
Trigger
  ↓
Plan immutable contract
  ↓
Fingerprint plan + initialize checkpoint
  ↓
Independent review when required
  ↓
Human approval for protected execution
  ↓
Validate checkpoint + lease + fingerprint
  ↓
Resume gate
  ↓
Process one bounded chunk
  ↓
Read-after-write verification
  ↓
Atomic checkpoint advance
  ↓
Next invocation or final verification
  ↓
completed / paused / blocked
```

## Stages
1. **Context** — Backfill Planner inspects model/schema, existing migration patterns, indexes, tests and operational constraints.
2. **Plan** — create plan from template, compute fingerprint, initialize checkpoint.
3. **Review** — Backfill Reviewer verifies cursor, idempotency, risk, verification and rollback.
4. **Approval** — production/destructive/schema/delete/irreversible actions stop for explicit human approval.
5. **Preflight** — run state validator and resume gate with current actor/time.
6. **Execute chunk** — external project-specific executor mutates at most configured chunk size. This kit does not contain production credentials or generic destructive SQL.
7. **Verify chunk** — compare expected affected keys/counts/invariants and read-back results.
8. **Checkpoint** — atomically advance using expected version only after verification.
9. **Completion** — when selection returns no more eligible rows, run final aggregate/business invariants and independent review; then set `completed`.

## Retry rules
- Transient connectivity/deadlock/rate-limit: max **2** retries for the same chunk.
- Checkpoint write version conflict: **0** retries without reload/re-evaluation.
- Validation/business/security/permission failure: **0** automatic retries.
- Whole-workflow resume attempts after crashes: max **3** without human/operator review.
- Preserve first failure, retry count, idempotency key and affected-key evidence.

## Approval points
Approval is required before production backfill start and all actions in `approval_required_actions`. Changed predicate/transform/scope invalidates prior approval and requires a new plan revision/approval.

## Failure paths
Unknown write outcome → read back by idempotency key; do not blind-retry. Foreign active lease → stop. Fingerprint drift → new revision. Verification mismatch → pause/blocked. Retry budget exhausted → escalate with checkpoint/evidence.

## Definition of Done
Current plan/checkpoint validate; required review/approval exists; all chunks verified before checkpoint advance; no unresolved unknown writes; final source/target/business invariants pass; checkpoint status is `completed`; remaining risks are explicit and non-blocking.
