# Workflow: Redis Distributed Lock Safety Gate

## Trigger
Duplicate processing, concurrent job overlap, stale writes after lease expiry, unsafe unlock/renew code, or a requested change to Redis locking.

## Entry conditions
Repository is readable; affected resource and lock caller can be identified; no production mutation is required to investigate.

## Inputs
Task statement, repository, runtime evidence when available, `config/lock-policy.yaml`.

## Context
Lock implementation, callers, key construction, critical section, protected writes, cancellation/error handling, tests, and Redis client configuration.

## Stages
1. **Context** — Lock Investigator maps facts, hypotheses, lease timing, ownership checks, fencing, and evidence.
2. **Plan checkpoint** — reject plans that rely on unconditional delete, infinite retries, or a lease alone for stale-write prevention.
3. **Approval checkpoint** — stop for human approval if lock scope changes, fencing is disabled, lease exceeds 120 seconds, or production force unlock is proposed.
4. **Execute** — Lock Implementer applies the smallest safe remediation.
5. **Deterministic test** — run unit/integration tests and `scripts/redis_lock_gate.py` against local/test Redis as appropriate.
6. **Review** — inspect diff for unrelated API/schema/infrastructure/security changes.
7. **Independent verification** — Lock Verifier challenges contention, expiry, ownership mismatch, cancellation, and fencing.
8. **Complete** — emit verified evidence and residual risk.

## Responsible agents
Investigation: Lock Investigator. Implementation: Lock Implementer. Final verification: Lock Verifier.

## Produced artifacts
Findings, code/tests where applicable, verification output, approval evidence, residual-risk report.

## Checkpoints
- Protected resource and lock key scope are explicit.
- Critical-section duration is compared with lease.
- Owner verification is atomic for renew/release.
- Fencing or an equivalent stale-write defense is present for non-idempotent protected writes.

## Retry rules
Transient Redis connection/test-environment failures: maximum 2 retries with evidence preserved. Acquisition itself: maximum 3 retries per policy. Implementation correction after verification failure: maximum 1 remediation cycle, followed by full reverification.

## Failure paths
Missing context → `blocked-context`. Permission/production access required → `blocked-approval`. Test/build failure → `failed-verification`. Lost lease during protected work → stop side effects and return `lost-ownership`. Repeated transient environment failure → `blocked-environment`.

## Stop conditions
Any missing required approval, destructive unexpected diff, unresolved stale-holder write path, lost ownership, or inability to run required verification.

## Definition of Done
Lock lifecycle is evidenced; owner checks are atomic; retry/lease behavior is bounded; stale holders are rejected by fencing/equivalent defense; required tests pass; independent verification passes; approvals are recorded; no blocking risk remains.
