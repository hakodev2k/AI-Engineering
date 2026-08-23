# Cancellation Propagation Gate Workflow

## Trigger
New or changed async orchestration, background work, retries, external I/O, process spawning, or an incident where work continued after cancellation.

## Entry conditions
Clean enough working tree to attribute changes; relevant source available; destructive production actions excluded unless separately approved.

## Inputs
Repository root, task scope, cancellation primitive, build/test commands, optional incident evidence.

## Stages
1. **Context — Repository Explorer:** map entry points and child work. Artifact: exploration notes.
2. **Plan — workflow owner:** classify edges and choose smallest changes/tests.
3. **Execute — implementation owner:** propagate cancellation and fix lifetime defects.
4. **Static check:** run `python scripts/cancellation_gate.py --root . --config config/cancellation-policy.yaml --out cancellation-report.json`.
5. **Runtime check:** run repository tests plus cancellation-focused tests.
6. **Review — Verification Agent:** independently inspect diff, report, and runtime evidence.
7. **Complete:** produce evidence using `templates/cancellation-evidence.md`.

## Checkpoints
After mapping; before any approval-required action; after static gate; after runtime test; before completion.

## Retry rules
Transient command/tool failure: 2 retries. Build/test repair loop: maximum 2 cycles and only when evidence identifies a distinct fix. Static validation failure is not retryable without a code/config change. Permission failure stops immediately.

## Evidence preserved
Original finding, command, exit code, logs, reproduction checkpoint, changed files, retry number, final result.

## Approval points
Production deployment, destructive cleanup, schema/data change, infrastructure change, secret/config change, breaking API contract, security weakening, force push/history rewrite.

## Failure paths
Unexplained high finding -> `not_verified`. Environment unavailable -> `blocked`. Runtime orphan persists after two repair cycles -> stop with evidence. Approval missing -> stop before action.

## Definition of Done
Static gate passes or all findings have approved evidence; cancellation runtime checks pass; no orphan business work remains; independent verification is `verified`; required approvals exist; remaining non-blocking risks are recorded.