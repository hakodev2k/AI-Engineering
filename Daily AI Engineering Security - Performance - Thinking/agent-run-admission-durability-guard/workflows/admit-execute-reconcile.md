# Workflow: Admit, Execute, Reconcile

## Trigger
Creation or modification of a fire-and-forget/background agent-run path, or a restart-loss incident.

## Goal
Eliminate the invisible window in which work is acknowledged but no durable record exists, then prove bounded restart recovery.

## Inputs
Run-create request, stable run ID, idempotency key, persistent ledger, execution/checkpoint state, restart signal, recovery policy.

## Baseline
Measure current ordering of durable admission, external acknowledgement, execution start and first checkpoint. Record any accepted run that can disappear after an injected crash.

## Context
Use host queue/database durability guarantees, current checkpoint semantics and side-effect safety policy.

## Stages
1. **Observe** — trace request through acknowledgement, admission storage, execution and checkpointing.
2. **Measure baseline** — run deterministic ledger checks and a controlled pre-first-checkpoint crash experiment.
3. **Diagnose** — identify ack-before-commit, unstable identity, missing reconciliation, duplicate admission or unsafe replay.
4. **Form hypothesis** — select the smallest persistence/order change that closes the admission gap.
5. **Implement admission** — persist `run_id`, idempotency key and accepted state transactionally before acknowledgement.
6. **Execute** — start work only after durable admission; continue existing checkpoint strategy.
7. **Restart reconcile** — scan accepted non-terminal records; classify each as known-started, terminal or recovery-required.
8. **Recover** — enqueue safe recovery, maximum 2 attempts; consequential side effects require appropriate approval/idempotency.
9. **Measure again** — rerun validator and crash/restart cases.
10. **Verify** — independent Recovery Verifier reviews evidence.

## Responsible agent
Workflow/platform implementer for change; Recovery Verifier for final review.

## Tools
Persistent-store inspection, traces/logs, controlled process restart, `scripts/admission_guard.py`, test suite.

## Outputs
Baseline, durable ledger, before/after violations, crash/restart evidence, reconciliation report, verification decision.

## Checkpoints
Do not acknowledge before admission commit. Do not automate recovery without stable identity. Do not complete with an unreconciled accepted run.

## Metrics
Ack-before-admission violations; orphan count; duplicate identity count; reconciliation coverage; bounded recovery count; restart recovery success rate.

## Retry policy
Maximum 2 recovery attempts per run. A remediation implementation may be revised at most twice before escalation.

## Stop conditions
Persistence commit cannot be proven; duplicate logical identity is unresolved; recovery risks irreversible duplication; retry maximum reached.

## Failure path
Persist failure/recovery state, stop automatic retry, surface affected run IDs and escalate to operator. Never erase the evidence or downgrade verification.

## Verification
Crash before/after acknowledgement and before first execution checkpoint; restart; confirm every acknowledged run remains represented and reaches an allowed reconciled state.

## Definition of Done
Baseline captured; admission is durable before acknowledgement; stable idempotency enforced; restart reconciliation covers 100% of accepted non-terminal records; retries bounded; tests and independent review pass.