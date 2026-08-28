# Feature Engineering Rules

## Purpose
Keep recommendation features correct, available, privacy-aware, and consistent between training and serving.

## Scope
Applies to user, item, context, interaction, aggregate, embedding, and derived features.

## MUST
- Every production feature MUST have a defined owner, semantics, data type, freshness expectation, and missing-value behavior.
- Training and serving transformations MUST be equivalent or explicitly validated for acceptable skew.
- Features derived from future information relative to the prediction point MUST be excluded from training.
- Sensitive or regulated attributes MUST have documented authorization and purpose before use.
- Feature deprecation MUST identify dependent models and serving paths before removal.

## MUST NOT
- MUST NOT silently substitute materially different features when upstream data is unavailable.
- MUST NOT use leakage-prone aggregates without point-in-time correctness.
- MUST NOT encode secrets or raw sensitive identifiers into logs or model-debug output.

## SHOULD
- Features SHOULD be reusable and centrally defined when multiple models depend on the same semantics.
- High-cost online features SHOULD have bounded latency and fallback values.

## Exceptions
Exceptions require documented data semantics, risk, evidence, and approval where privacy or material ranking impact is involved.

## Verification
Review feature definitions, point-in-time tests, training-serving skew metrics, lineage, access controls, and dependency graphs.