# Workflow: Safe Dead-Letter Queue Replay

## Trigger
A DLQ backlog remains after a transient dependency incident or a consumer defect has been corrected and historical messages require controlled reprocessing.

## Entry conditions
Queue identity and consumer are known; repository is readable; candidate messages can be exported or sampled without mutation.

## Inputs
Message export, logs/traces, consumer source, queue retry/dead-letter configuration, `config/replay-policy.json`, target environment.

## Flow
```text
Trigger
  ↓
DLQ Investigator
  ↓
Root cause + idempotency evidence
  ↓
Deterministic plan gate
  ↓
blocked/needs-review? ─ yes → fix evidence/root cause → plan again (max 2 planning retries)
  │
  no
  ↓
Replay Planner
  ↓
Production? ─ yes → Human approval checkpoint
  ↓
Approved operator executes one bounded batch
  ↓
Export receipts + observe consumer/downstream
  ↓
Independent Verification Agent
  ↓
verified? ─ no → stop further batches + investigate
  ↓
yes
  ↓
Next batch, bounded by plan
  ↓
Final reconciliation
```

## Stages
1. **Context** — Investigator traces consumer entry point, schema validation, retries, DLQ behavior, idempotency, and side effects.
2. **Evidence** — Candidate messages are exported; facts/hypotheses/open questions are separated.
3. **Planning** — `dlq_replay_gate.py plan` classifies each message and generates bounded batches.
4. **Implementation** — If a consumer fix is required, normal repository implementation/test workflow runs before replay planning is repeated.
5. **Approval** — Production replay requires explicit human approval. Schema/data/infrastructure/security changes require separate approval.
6. **Execution** — An approved external queue tool performs only the current batch. This package never auto-executes production replay.
7. **Observation** — Capture replay receipts plus consumer error rate, downstream side effects, and deduplication evidence.
8. **Verification** — Independent verifier runs `reconcile` and checks observability evidence.
9. **Continuation** — Only a verified batch permits the next batch.
10. **Completion** — All planned eligible messages reconciled; blocked messages remain documented.

## Tools
Repository read/edit tools, queue export/approved replay tool, logs/traces, `scripts/dlq_replay_gate.py`, repository-native tests.

## Produced artifacts
`.dlq/messages.jsonl`, `.dlq/replay-plan.json`, `.dlq/replay-receipts.jsonl`, `.dlq/verification.json`, investigation evidence, approval record.

## Checkpoints
- Root cause is fixed or demonstrably transient.
- Idempotency/deduplication is proven.
- Deterministic plan contains no intended `blocked`/`needs-review` messages.
- Production approval is recorded before replay.
- Every completed batch is independently verified before continuation.

## Retry rules
- Export/log/query tool failures: maximum 2 retries when transient; preserve error evidence.
- Planning retry after missing evidence/root-cause repair: maximum 2.
- Production replay attempt per message: maximum 1 by default; no automated repeat after ambiguous outcome.
- Failed reconciliation: 0 automatic replay retries. Investigate first.

## Stop conditions
Stop immediately on unexpected side effects, rising consumer error rate, receipt mismatch, duplicate execution evidence, authorization errors, schema/business-rule failures, or any action requiring unapproved privilege/config/data changes.

## Approval points
Explicit human approval is required for production replay, destructive queue operations, DLQ deletion/purge, schema/database changes, production configuration, security-control changes, secrets, infrastructure, force push/history rewrite, or large dependency upgrades.

## Failure paths
- **Validation failure:** block affected messages.
- **Build/test failure:** fix before replay; max 3 implementation cycles in the host development workflow.
- **Tool/environment failure:** bounded transient retry only.
- **Permission failure:** stop; do not escalate privileges automatically.
- **Business-rule/schema failure:** quarantine until corrected by an approved change.
- **Ambiguous replay result:** treat as unverified; reconcile external state before any retry.

## Definition of Done
Investigation complete; root cause addressed; idempotency proven; plan generated; required approvals recorded; each replayed batch verified; all eligible message receipts reconciled; blocked messages and remaining risks documented; no blocking failure remains.
