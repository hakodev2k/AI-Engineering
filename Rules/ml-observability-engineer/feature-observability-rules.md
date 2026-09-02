# Feature Observability

## Purpose
Ensure production features remain semantically correct and consistent with the assumptions under which models were evaluated.

## Scope
Applies to online, offline, computed, embedded, and shared features used in training or inference.

## MUST
- Critical features MUST have documented definitions, lineage, owners, freshness expectations, and acceptable value behavior.
- Training-serving skew MUST be measured or otherwise bounded for features whose computation paths differ.
- Feature-version changes MUST be traceable to affected model versions and deployments.
- Feature monitoring MUST distinguish source-data defects from transformation defects.

## MUST NOT
- MUST NOT assume identically named training and serving features are semantically equivalent without verification.
- MUST NOT silently substitute default values when doing so can materially alter predictions.
- MUST NOT change feature semantics without compatibility and model-impact review.

## SHOULD
- Monitor null rates, cardinality, distributions, freshness, and transformation invariants according to feature risk.
- Prefer shared, versioned feature definitions where they reduce semantic divergence.

## Exceptions
Unmonitored features require documented low-risk justification, alternative evidence, and periodic reassessment.

## Verification
Inspect feature lineage, transformation tests, skew reports, version metadata, incident evidence, and model-impact reviews.