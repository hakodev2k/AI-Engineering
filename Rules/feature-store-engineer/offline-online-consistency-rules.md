# Offline and Online Consistency Rules

## Purpose
Prevent training-serving skew between historical and real-time feature computation.

## Scope
Shared transformations, materialization, serialization, defaults, rounding, timestamps, and missing-value handling.

## MUST
- Features used in both training and serving MUST have semantically equivalent computation paths.
- Differences between offline and online implementations MUST be documented and tested.
- Numeric precision, category normalization, timezone handling, and default values MUST be consistent where model behavior depends on them.
- Consistency checks MUST compare representative offline and online outputs.
- Production incidents caused by skew MUST result in regression coverage.

## MUST NOT
- MUST NOT reimplement complex feature logic independently in multiple paths without equivalence tests.
- MUST NOT silently tolerate unexplained drift between offline and online values.
- MUST NOT compare values without accounting for documented timing windows.

## SHOULD
- Reuse shared declarative transformations or generated logic where practical.
- Run periodic skew checks on sampled production entities.

## Exceptions
Intentional divergence requires rationale, bounded impact, and model-owner approval.

## Verification
Review parity tests, sampled comparisons, transformation lineage, and skew dashboards.