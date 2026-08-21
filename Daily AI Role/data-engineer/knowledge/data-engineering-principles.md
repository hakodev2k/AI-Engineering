# Data Engineering Principles

- A successful job can still produce wrong data; correctness needs independent evidence.
- Data contracts define ownership, shape, semantics, timeliness and evolution expectations.
- Idempotency makes retries and replay safer; checkpointing makes partial progress recoverable.
- Event time and processing time are different and both may matter.
- Late-arriving data needs explicit windows and update semantics.
- Raw/source-preserving layers improve replay and auditability when retention permits.
- Partitioning should reflect access patterns and avoid pathological tiny files/partitions.
- Incremental processing reduces cost but increases state-management complexity.
- Lineage is operational information: it determines blast radius, migration order and recovery sequence.
- Quality thresholds must map to consumer fitness, not arbitrary percentages.
