# Vector Index Rules

## Purpose
Maintain correct, efficient, and recoverable semantic indexes.

## Scope
Index types, distance metrics, parameters, sharding, replication, rebuilds, and compaction.

## MUST
- Index configuration MUST match the embedding model's similarity assumptions.
- Recall and latency trade-offs MUST be measured on representative workloads.
- Index rebuilds MUST be versioned and support controlled cutover.
- Critical indexes MUST have recovery or deterministic regeneration procedures.
- Sharding keys MUST avoid predictable hot partitions.

## MUST NOT
- MUST NOT change distance metrics or ANN parameters in production without evaluation.
- MUST NOT destroy the only recoverable index copy before replacement validation.
- MUST NOT treat index count equality as proof of content correctness.

## SHOULD
- Track index size, recall proxy metrics, query latency, and build duration.
- Use immutable index versions for high-risk migrations.

## Exceptions
In-place changes require bounded risk, rollback evidence, and approval.

## Verification
Review benchmark results, index metadata, rebuild tests, cutover plans, and sampled retrieval comparisons.