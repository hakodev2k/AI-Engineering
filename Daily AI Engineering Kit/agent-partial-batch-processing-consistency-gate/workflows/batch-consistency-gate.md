# Partial Batch Processing Consistency Gate Workflow

## Trigger
A new or changed multi-item batch job, partial-processing incident, retry/checkpoint change, or pre-release review of a resumable batch.

## Entry conditions
Target batch and repository are known; non-destructive inspection is permitted.

## Inputs
Batch entry point, item source/identity, checkpoint state, retry semantics, side effects, completion/reporting logic, tests/logs.

## Stages
1. **Context** — Batch Investigator maps source → pagination/cursor → item handler → effects → checkpoint → completion report.
2. **Static scan** — run `python3 scripts/scan-batch-consistency.py <repo> --output scan.json`; exit 1 means findings need review, not automatic failure.
3. **Hypothesis** — classify partial-commit, swallowed-failure, retry-scope, checkpoint, concurrency, and false-success risks.
4. **Plan** — define one middle-item failure test, one restart/retry test, and count-reconciliation assertions.
5. **Approval checkpoint** — stop if remediation requires schema change, production config/deployment, deletion, queue purge, breaking contract, or irreversible backfill.
6. **Execute** — implement only approved/in-scope changes.
7. **Test** — inject one item failure; verify preceding/following item outcomes, checkpoint position, retry scope, and no duplicate effects.
8. **Reconcile** — discovered items must reconcile to terminal/intermediate result categories according to the business contract.
9. **Review** — inspect diff and confirm no weakened assertions or unrelated behavior.
10. **Independent verification** — Batch Verification Agent reruns focused checks and challenges checkpoint/completion assumptions.
11. **Contract validation** — save assessment JSON and run `python3 scripts/validate-assessment.py assessment.json`.

## Checkpoints
Stable item identity known; item effects enumerated; checkpoint ordering known; failure policy explicit; completion formula defined.

## Retry rules
Maximum two retries for transient tool/test-environment failures. Preserve command, output, failed item identity, checkpoint state, and attempt number. Deterministic failures require diagnosis/change before rerun. After two transient failures, status is `blocked`.

## Failure paths
Permission/environment failure → preserve evidence and block. Business-rule ambiguity → block pending owner clarification. Verification failure → `fail`. Dangerous remediation → `needs-approval` before mutation.

## Stop conditions
Required context unavailable; stable item identity cannot be established; dangerous action lacks approval; two repeated transient failures; unresolved duplicate/lost item behavior remains.

## Produced artifacts
`scan.json` when scanner is used and an assessment matching `schemas/assessment.schema.json`.

## Definition of Done
Assessment validates; partial failure and restart/retry were tested or explicitly blocked with evidence; completion counts reconcile; checkpoint behavior is verified; independent verification completed; approvals obtained where required; remaining risks recorded; no blocking failure remains for `pass`.
