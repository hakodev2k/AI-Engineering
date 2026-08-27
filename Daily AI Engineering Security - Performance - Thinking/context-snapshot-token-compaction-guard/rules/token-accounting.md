# Rules: Token Accounting and Compaction

- Every token counter used for compaction MUST declare semantic provenance.
- `cumulative_usage` MUST NOT be treated as `context_snapshot_tokens`.
- Automatic compaction MUST require a current snapshot or a documented conservative estimate with explicit uncertainty.
- Compaction MUST NOT occur below the configured utilization threshold unless a separate hard provider limit is evidenced.
- Snapshot values that materially exceed last-call input/cache evidence MUST be treated as inconsistent and remeasured.
- Current goal, constraints, approvals, decisions and verification status MUST be preserved across compaction.
- Post-compaction continuation MUST be blocked when required critical-state fields are missing.
- Token savings MUST NOT override correctness, security boundaries or approval requirements.
- Before/after token and latency measurements SHOULD be recorded for every automatic compaction.
- Retry loops MUST be bounded to two measurement attempts.
