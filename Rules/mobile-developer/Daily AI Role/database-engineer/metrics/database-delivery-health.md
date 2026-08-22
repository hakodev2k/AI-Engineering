# Database Delivery Health Metrics

Use trends, not vanity targets.

- Change failure rate: database changes causing rollback, incident, or urgent remediation.
- Verification completeness: changes with recorded correctness, health, and risk evidence.
- Migration guard coverage: high-risk changes with explicit abort thresholds and recovery path.
- Performance evidence quality: tuning changes with comparable before/after measures.
- Restore confidence: critical databases with a recent successful isolated restore drill and measured RPO/RTO.
- Repeat incident rate: recurrence of the same causal class after remediation.
- Unbounded maintenance work: long-running backfills/index/rewrite operations without checkpoint or throttle.
- Toil ratio: repeated manual database work suitable for safe deterministic automation.

Metrics MUST NOT incentivize hiding incidents, skipping verification, or avoiding necessary changes.