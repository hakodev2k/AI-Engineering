# Join Semantics
## Purpose
Prevent silent loss, explosion, and temporal mismatch in streaming joins.
## Scope
Stream-stream and stream-table joins.
## MUST
- Join keys, temporal bounds, null behavior, cardinality assumptions, and late-data behavior MUST be documented.
- Stream-stream joins MUST bound retained state unless an explicitly justified design proves otherwise.
- Reference data freshness and consistency expectations MUST be defined for stream-table joins.
## MUST NOT
- Many-to-many joins MUST NOT enter production without measured amplification limits.
## SHOULD
- Join selectivity and unmatched rates SHOULD be observable.
## Exceptions
Unbounded joins require architecture approval and capacity evidence.
## Verification
Test missing counterparts, duplicates, late counterparts, skew, updates, and worst-case amplification.