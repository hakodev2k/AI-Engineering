# Storage Format and Layout Rules

## Purpose
Ensure physical data layout supports correctness, interoperability, lifecycle management, and measured performance.

## Scope
Applies to object storage, distributed files, columnar formats, partitioning, clustering, compression, and physical dataset organization.

## MUST
- Storage format and layout choices MUST be justified by workload, interoperability, schema-evolution, retention, and recovery requirements.
- Partition keys and file sizing MUST be selected using measured access patterns and expected data distribution.
- Layout changes affecting readers MUST have a compatibility and migration plan.
- Data written to durable storage MUST use integrity-preserving publication semantics that prevent consumers from mistaking incomplete output for complete data.
- Retention and deletion behavior MUST align with data classification and governance requirements.

## MUST NOT
- MUST NOT optimize partitioning from assumptions alone when representative query or scan evidence is available.
- MUST NOT create unbounded small-file growth without compaction or lifecycle controls.
- MUST NOT change encoding, compression, or format in a way that silently breaks supported consumers.

## SHOULD
- Prefer open, well-supported formats when portability and multi-engine access matter.
- SHOULD benchmark compression, scan cost, and write amplification before material layout changes.

## Exceptions
Exceptions require documented constraints, compatibility impact, evidence, migration or rollback strategy, and owner approval.

## Verification
Review storage statistics, query profiles, compatibility tests, file-size distributions, partition pruning evidence, retention configuration, and migration tests.