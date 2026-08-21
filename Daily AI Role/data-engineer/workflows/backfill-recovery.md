# Backfill Recovery Workflow

1. Confirm defect/correction and exact affected time/partition range.
2. Pause conflicting writers or establish isolation.
3. Parallelize lineage review, cost estimate and target-state quality baseline.
4. Prepare `templates/backfill-plan.md` with checkpoints, rollback/compensation and approvals.
5. Dry-run representative partitions.
6. Execute chunks sequentially when they share write targets; independent partitions may run in bounded parallelism.
7. Reconcile each chunk.
8. Stop on divergence, cost breach or consumer degradation.
9. Final reconcile, refresh dependents in order and resume schedules.
10. Record evidence and learning.
