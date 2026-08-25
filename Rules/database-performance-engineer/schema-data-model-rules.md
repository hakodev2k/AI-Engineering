# Schema and Data Model Performance Rules
## Purpose
Prevent structural data-model choices from creating persistent performance bottlenecks.
## Scope
Table shape, keys, relationships, normalization, denormalization, and physical data layout.
## MUST
- Evaluate access patterns and growth projections before material schema changes.
- Preserve integrity while quantifying performance benefits of denormalization or duplication.
- Assess key width, row width, and relationship design where they affect hot paths.
## MUST NOT
- Denormalize solely to avoid measured query tuning work.
- Sacrifice correctness or integrity for unverified performance gains.
## SHOULD
- Keep performance-sensitive structures simple enough to reason about operationally.
## Exceptions
Purpose-built analytical or caching structures may duplicate data when ownership, freshness, and reconciliation are explicit.
## Verification
Review schema diffs, workload evidence, integrity constraints, storage projections, and representative benchmarks.