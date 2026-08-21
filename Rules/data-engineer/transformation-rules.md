# Transformation Rules
## Purpose
Keep transformations correct, understandable, and reproducible.
## Scope
SQL, Spark, dbt, stream processing, and other transformation logic.
## MUST
- Transformations MUST have explicit inputs, outputs, keys, and business semantics.
- Non-trivial derivations MUST be testable with representative data.
- Transformations MUST be deterministic unless nondeterminism is intentional and documented.
- Expensive transformations MUST be measured before optimization claims are accepted.
## MUST NOT
- MUST NOT bury business-critical logic in undocumented ad hoc scripts.
- MUST NOT depend on implicit row order unless guaranteed by the processing model.
## SHOULD
- Prefer small composable stages with clear ownership.
## Exceptions
One-off transformations require retained evidence when they affect governed data.
## Verification
Review code, tests, lineage, sample outputs, runtime metrics, and reproducibility.