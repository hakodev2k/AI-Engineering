# Feature Engineering Rules

## Purpose
Ensure fraud features are leakage-safe, reproducible, temporally correct, and production-compatible.

## Scope
Offline and online features used by fraud models or scoring logic.

## MUST
- Features MUST use only information available at the decision timestamp unless explicitly designed for retrospective analysis.
- Offline and online feature semantics MUST be equivalent for production scoring.
- Feature windows, joins, defaults, and entity keys MUST be explicitly defined.
- High-value features MUST have quality and drift monitoring.

## MUST NOT
- MUST NOT introduce target leakage, future information, or post-outcome attributes into predictive features.
- MUST NOT silently backfill production defaults that differ from training behavior.

## SHOULD
- Features SHOULD be reusable through governed definitions when shared across models.
- High-cardinality and identity-derived features SHOULD be assessed for privacy and memorization risk.

## Exceptions
Require documented analytical purpose, separation from production prediction, and validation.

## Verification
Run temporal leakage tests, offline-online parity tests, lineage review, feature quality checks, and production trace comparison.