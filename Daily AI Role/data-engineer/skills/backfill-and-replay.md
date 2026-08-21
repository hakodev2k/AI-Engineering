# Backfill and Replay

**Purpose:** safely recompute historical data.

**Inputs:** affected range, target datasets, correction logic, dependency graph, write semantics, cost estimate.

**Preconditions:** normal pipeline state known; replay is deterministic or compensation is defined.

**Procedure**
1. Define exact ranges, partitions and reason.
2. Snapshot current state/evidence if rollback requires it.
3. Identify upstream/downstream dependencies and consumers.
4. Estimate compute, storage and operational cost.
5. Choose chunk size and checkpoint format.
6. Dry-run or sample-run first.
7. Require approval for destructive or high-cost execution.
8. Execute bounded chunks; record completed checkpoints.
9. Reconcile each chunk and final aggregate.
10. Resume normal schedules only after freshness and correctness gates pass.

**Stop:** unexpected divergence, downstream breakage, cost threshold breach or quality failure.
