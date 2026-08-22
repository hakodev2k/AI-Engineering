# Workflow — Terminal Reconciliation

## Trigger
Before a delegated task reports success/failure, or when parent and child lifecycle evidence disagree.

## Goal
Map orchestration state to an evidence-backed objective outcome.

## Inputs
Parent status, expected child set, child registry, terminal receipts, acceptance checks, committed effects, and retry/cancellation lineage.

## Baseline
Measure false-success, false-failure, retry, and unresolved-outcome rates on representative multi-agent tasks before enabling the gate.

## Context
Task acceptance criteria and observable lifecycle evidence only.

## Stages
1. **Observe** — capture parent status and expected required children.
2. **Measure baseline state** — query child registry, terminal receipts, artifacts, tests, and committed-effect evidence.
3. **Diagnose** — classify each child as missing, not-started, running, terminal-success, terminal-failure, interrupted, or ambiguous.
4. **Form hypothesis** — identify whether the parent label is supported or contradicted by lifecycle evidence.
5. **Reconcile** — refresh incomplete lifecycle evidence and inspect durable effects.
6. **Acceptance checkpoint** — run required objective checks independently of child self-report.
7. **Outcome mapping** — produce verified_success, partial, reconcile, failed, or blocked.
8. **Independent verification** — `subagents/outcome-verifier.md` verifies high-impact results.

## Responsible agent
Parent coordinator gathers state; Outcome Verifier performs independent terminal verification.

## Tools
Child lifecycle registry, artifact/test stores, durable receipts, and `scripts/reconcile_outcomes.py`.

## Outputs
Reconciled outcome, per-child evidence status, missing evidence, acceptance result, recovery recommendation, and verification record.

## Checkpoints
- Required child set exists before success evaluation.
- All required children have required start and terminal evidence before verified success.
- Acceptance checks pass before verified success.
- Unknown committed work blocks blind retry.

## Metrics
False-success rate, false-failure rate, terminal-evidence coverage, preserved interrupted work, duplicate retries prevented, reconciliation p95 latency, unresolved-outcome rate.

## Retry policy
Lifecycle/evidence reads may be reconciled at most twice. Do not retry delegated work while commit state is unknown.

## Stop conditions
Stop on conclusive verified_success/failed or after the configured reconciliation attempts. Unresolved high-impact state becomes blocked.

## Failure path
Preserve known child artifacts and receipts. Emit partial/reconcile/blocked with missing evidence. Never convert ambiguity to success or erase durable work to simplify recovery.

## Verification
Run `tests/outcome-fixtures.json` and integration scenarios that simulate a required child never starting plus an interrupted child whose artifacts already satisfy acceptance.

## Definition of Done
All required children are explicitly tracked; terminal and acceptance evidence is captured; unsupported success is blocked; interrupted durable work is reconciled before retry; metrics are collected; high-impact outcomes receive independent verification; no unresolved blocking outcome remains.
