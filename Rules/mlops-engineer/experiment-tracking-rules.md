# Experiment Tracking Rules

## Purpose
Make experimental conclusions auditable and prevent selective or irreproducible model promotion.

## Scope
Covers model experiments, tuning runs, ablations, evaluations, and candidate comparisons.

## MUST
- Material experiments MUST record parameters, code revision, data references, environment, metrics, artifacts, and run status.
- Candidate selection MUST use predefined or explicitly documented evaluation criteria appropriate to the use case.
- Comparisons MUST use compatible datasets, metric definitions, and evaluation procedures.
- Failed or unfavorable runs relevant to a decision MUST remain discoverable.

## MUST NOT
- Teams MUST NOT cherry-pick a favorable run while concealing materially contradictory evidence.
- Experiment names or mutable dashboard state MUST NOT be the sole identity of a release artifact.

## SHOULD
- Important decisions SHOULD link to experiment records and explain trade-offs, uncertainty, and rejected alternatives.
- Hyperparameter searches SHOULD preserve search space and stopping criteria.

## Exceptions
Low-cost exploration may use lighter metadata, but any run supporting a release decision MUST satisfy this policy before promotion.

## Verification
Inspect experiment records, metric definitions, comparison cohorts, run artifacts, and release decision links. Confirm that selected candidates can be traced to complete run metadata.