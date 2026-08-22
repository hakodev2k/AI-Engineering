# Workflow: Background Job Overlap Safety

## Trigger
A recurring/queued job is added or changed, duplicate effects are observed, runtime exceeds schedule interval, retry behavior changes, or worker parallelism changes.

## Entry conditions
Repository is available; job or scheduler scope is identifiable; read-only investigation is permitted.

## Inputs
Job identity, scheduler definitions, code, retries/timeouts, worker concurrency, logs/metrics when available, relevant tests.

## Flow

```text
Trigger
  ↓
Repository + scheduler context
  ↓
Job Explorer investigation
  ↓
Evidence-backed overlap finding?
  ├─ no → Verify existing safety → Complete/unverified
  └─ yes
       ↓
Design smallest concurrency/idempotency fix
       ↓
Approval gate if required
       ↓
Implement
       ↓
Concurrent tests + build
       ↓
Independent Concurrency Verifier
       ↓
Verified safe / retry / escalate
```

## Stages
1. **Preflight** — run `scripts/scan-job-overlap.py --root <repo> --output overlap-findings.json`; responsible: Job Explorer.
2. **Context** — map triggers, retry paths, runtime evidence, critical sections, and side effects using `skills/investigate-job-overlap.md`.
3. **Plan** — choose serialization, keyed serialization, idempotency, atomic state transition, or a combination using `skills/design-concurrency-safety.md`.
4. **Approval** — stop before any policy item requiring human approval.
5. **Execute** — implement the smallest scoped fix and tests. Keep unrelated refactors out of the change.
6. **Test** — require at least one concurrent-start test. When relevant add retry-after-timeout and stale-lock recovery tests.
7. **Review** — inspect changed files and scanner output; preserve evidence.
8. **Verify** — Concurrency Verifier independently checks tests, ownership semantics, retries, idempotency, and final diff.
9. **Complete** — produce verified status and remaining risks.

## Checkpoints
- Trigger inventory complete before design.
- Side-effect inventory complete before implementation.
- Approval recorded before approval-required action.
- Concurrent test passes before `verified-safe`.

## Retry rules
Maximum two implementation/test retries. Retryable: deterministic test failure caused by the new fix, transient local tool failure, or a narrowly corrected lock/idempotency implementation. Preserve previous failing output. After two failures, stop and escalate.

## Failure paths
- Missing scheduler/runtime evidence → mark `unverified`; do not invent safety.
- Permission failure → preserve missing access and stop that branch.
- Existing unrelated build failure → record baseline evidence; do not attribute it to the change without proof.
- Approval denied/missing → status `blocked`.

## Stop conditions
Stop immediately for required approval, unsafe production mutation, permission escalation request, or exhausted retry budget.

## Definition of Done
- Triggers/retries and side effects are mapped.
- Overlap semantics are explicit.
- Required fix exists when needed.
- Concurrent test proves serialization, deduplication, or safe conflict handling.
- Build/relevant tests pass or unrelated baseline failures are documented.
- Independent verification is `verified-safe`.
- No approval-required action occurred without approval.
- No blocking risk remains undisclosed.
