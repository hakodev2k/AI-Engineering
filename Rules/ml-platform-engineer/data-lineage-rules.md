# Data Lineage

## Purpose
Make ML inputs and derived artifacts traceable across pipelines and environments.

## Scope
Datasets, labels, features, transformations, models, evaluations, and predictions.

## MUST
- Production-relevant artifacts MUST trace to source data and transformation identities.
- Lineage MUST preserve dataset/version boundaries needed to reproduce or investigate a model.
- Material lineage gaps MUST be treated as release risk and explicitly resolved or accepted.

## MUST NOT
- A derived dataset MUST NOT be represented as equivalent to its source when transformations affect semantics.
- Lineage metadata MUST NOT contain secrets or unnecessary sensitive payloads.

## SHOULD
- Lineage SHOULD be captured automatically at orchestration boundaries.

## Exceptions
External sources with incomplete lineage require provenance notes, trust boundaries, and compensating validation.

## Verification
Trace sampled production models backward to sources and forward to deployments; inspect metadata completeness and automated lineage checks.