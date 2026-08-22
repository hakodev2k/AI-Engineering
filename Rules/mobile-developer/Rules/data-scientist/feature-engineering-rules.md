# Feature Engineering Rules
## Purpose
Create reproducible, valid predictors without hidden leakage or instability.
## Scope
Transformations, encodings, aggregations, and feature selection.
## MUST
- Define feature semantics, source, transformation, availability time, missing-value behavior, and expected range.
- Reproduce training transformations identically at inference when deployed.
- Evaluate whether feature selection occurs inside the validation boundary.
## MUST NOT
- Introduce target leakage through aggregates, encodings, or post-outcome information.
- Depend on undocumented notebook state for production features.
## SHOULD
- Prefer stable, interpretable features when performance differences are immaterial.
## Exceptions
Experimental features must be isolated from production claims.
## Verification
Inspect lineage, transformation code, timestamps, train/serve parity tests, and validation pipeline.