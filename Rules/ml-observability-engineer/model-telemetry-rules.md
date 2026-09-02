# Model Telemetry

## Purpose
Ensure model-level telemetry is sufficient to detect behavioral regressions and explain production outcomes.

## Scope
Applies to predictions, scores, confidence-like signals, model metadata, and aggregated behavioral telemetry.

## MUST
- Production model telemetry MUST identify the deployed model version or immutable equivalent.
- Metrics MUST distinguish meaningful cohorts when aggregate values could hide material regressions.
- Distributional telemetry MUST use stable definitions and documented comparison windows.
- Telemetry changes that alter metric meaning MUST be versioned or explicitly migrated.

## MUST NOT
- MUST NOT log raw sensitive inputs or outputs merely to simplify monitoring.
- MUST NOT interpret uncalibrated model scores as probabilities unless calibration is established.
- MUST NOT compare model metrics across incompatible populations without documenting the population shift.

## SHOULD
- Track output distributions, abstentions, uncertainty indicators, and failure modes appropriate to the model type.
- Preserve enough metadata to reproduce aggregate calculations from retained evidence where practical.

## Exceptions
Reduced telemetry requires a documented privacy, cost, or technical constraint plus compensating monitoring and approval from the responsible owner.

## Verification
Inspect telemetry schemas, model-version tags, cohort definitions, metric documentation, privacy controls, and replay or recomputation tests.