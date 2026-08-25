# Batch and Bulk Load Rules
## Purpose
Protect online workloads while moving or transforming large data volumes efficiently.
## Scope
Bulk inserts, updates, deletes, ETL loads, backfills, and batch processing.
## MUST
- Estimate row count, log volume, lock duration, I/O, and runtime before large production batches.
- Use bounded batches, checkpoints, throttling, or resumability when a single transaction creates unacceptable risk.
- Monitor impact on replicas, backups, and online traffic.
## MUST NOT
- Execute destructive or high-volume production DML without explicit human approval and a recovery strategy.
- Assume staging performance predicts production impact without accounting for scale and concurrency.
## SHOULD
- Make long-running backfills restartable and observable.
## Exceptions
Small, proven-safe batches may follow standard change controls.
## Verification
Inspect execution plans, dry runs, batch sizing, log growth estimates, monitoring, approval records, and recovery tests.