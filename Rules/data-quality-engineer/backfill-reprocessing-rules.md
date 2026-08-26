# Backfill and Reprocessing Rules
## Purpose
Correct historical data without creating new inconsistencies or uncontrolled load.
## Scope
Backfills, replays, recomputation, correction windows, and validation.
## MUST
- Backfills MUST define scope, source-of-truth inputs, idempotency behavior, expected outputs, and rollback or recovery strategy.
- Production backfills affecting critical data MUST receive human approval before execution.
- Reprocessed results MUST be reconciled against expected counts and quality checks before publication.
## MUST NOT
- MUST NOT run unbounded historical rewrites against production without capacity and blast-radius analysis.
- MUST NOT assume replay order is irrelevant for stateful transformations.
## SHOULD
- Backfills SHOULD be chunked, resumable, observable, and rate-limited.
## Exceptions
Urgent corrections require explicit risk acceptance and enhanced monitoring.
## Verification
Review dry runs, query plans/capacity estimates, idempotency tests, approvals, reconciliation, and audit logs.