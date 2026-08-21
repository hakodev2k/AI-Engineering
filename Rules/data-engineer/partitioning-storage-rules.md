# Partitioning and Storage Rules
## Purpose
Keep storage layouts efficient, predictable, and aligned with access patterns.
## Scope
Warehouses, lakes, lakehouses, object storage, and analytical tables.
## MUST
- Partitioning and clustering choices MUST follow measured query and ingestion patterns.
- Storage formats MUST preserve required schema, compression, and interoperability characteristics.
- Small-file and skew risks MUST be monitored where distributed engines are used.
## MUST NOT
- MUST NOT over-partition high-cardinality dimensions without evidence.
- MUST NOT change storage layout without assessing cost and downstream compatibility.
## SHOULD
- Prefer formats and layouts that support pruning and efficient incremental processing.
## Exceptions
Specialized layouts require documented workload evidence.
## Verification
Inspect query plans, file statistics, scan volume, storage metrics, and before/after benchmarks.