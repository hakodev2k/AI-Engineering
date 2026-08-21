# Backfill and Reprocessing Rules
## Purpose
Control historical recomputation so corrections do not create new data or production failures.
## Scope
Backfills, replay, historical rebuilds, and correction jobs.
## MUST
- Backfills MUST define affected range, source snapshot assumptions, downstream impact, expected load, and validation criteria.
- Reprocessing MUST be idempotent or have explicit duplicate-prevention behavior.
- High-volume backfills MUST assess capacity and concurrency before execution.
- Corrected outputs MUST be reconciled against expected business totals or invariants.
## MUST NOT
- MUST NOT run unbounded production backfills without approval.
- MUST NOT overwrite trusted historical data without retained evidence and recovery strategy.
## SHOULD
- Prefer partition-bounded, throttled, observable execution.
## Exceptions
Emergency corrections require accountable approval and post-run reconciliation.
## Verification
Review execution plans, affected partitions, resource metrics, reconciliation, and audit records.