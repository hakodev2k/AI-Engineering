# Data Drift Detection

## Purpose
Detect meaningful changes in incoming data distributions before they silently degrade model behavior.

## When to use
Use in production monitoring, after source migrations, seasonality changes, or when model performance changes without code releases.

## Inputs
Reference dataset, current data, feature definitions, timestamps, segment keys, production metrics.

## Preconditions
A defensible reference window and relevant features are identified.

## Context to inspect
Source changes, feature transformations, seasonality, traffic mix, model versions, missingness, schema changes, and deployment events.

## Core knowledge
Drift can be covariate, prior, concept-related, or pipeline-induced. Statistical significance alone is not operational significance; large samples make tiny shifts look important.

## Procedure
1. Select stable reference windows.
2. Compute distribution metrics for critical features.
3. Segment by source, region, product, and relevant subgroup.
4. Compare numeric, categorical, text, and embedding distributions with appropriate methods.
5. Correlate drift with quality and model metrics.
6. Identify source or pipeline changes.
7. Rank drift by downstream sensitivity.
8. Define alert thresholds and persistence rules.
9. Validate alerts against historical incidents.
10. Document response actions for each drift class.

## Decision points
Alert on business-relevant change rather than statistical significance alone. Retrain only when drift affects model objectives or assumptions.

## Common failure patterns
Monitoring every feature equally, ignoring seasonality, reacting to one noisy interval, and retraining without root-cause analysis.

## Verification
Detected shifts are reproducible, attributable where possible, and tied to documented response criteria.

## Expected output
A drift report, prioritized affected features or segments, and monitoring configuration.

## Stop conditions
Stop when no valid reference population exists or upstream transformations prevent comparable measurement.