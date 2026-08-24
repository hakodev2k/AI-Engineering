# Rules — Occupancy Isolation
- Runtime **MUST** distinguish parent current-prompt occupancy, auxiliary usage and billable aggregate usage.
- Auxiliary usage **MUST NOT** increase parent occupancy unless parent transcript/context actually grows.
- Aggregate billing totals **MUST NOT** be used directly as compaction occupancy.
- Provider serialization differences **MUST** be measured before trusting local estimates.
- Changes **MUST** establish a baseline and replay the same workload after modification.
- Child usage **MUST NOT** be hidden merely to make occupancy pass.
- Overflow protection **MUST NOT** be weakened to improve compaction metrics.
- Unexplained drift above policy **MUST** block verification.
- Diagnosis loops **MUST** stop after two unsuccessful iterations.