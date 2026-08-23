# Data Leakage Prevention

## Purpose
Prevent information unavailable at real decision time from contaminating training, validation, features, or labels.

## When to use
Use during dataset construction, splitting, feature engineering, preprocessing, and model review.

## Inputs
Prediction timestamp, label definition, feature lineage, preprocessing pipeline, entities, and split strategy.

## Context to inspect
Event times, ingestion delays, future aggregates, repeated entities, label generation, target-derived fields, and transformations fitted globally.

## Core knowledge
Leakage may be temporal, target-based, group-based, duplicate-based, or preprocessing-based. Suspiciously strong offline performance is often a symptom. Point-in-time correctness is the governing principle.

## Procedure
1. Define exactly when a prediction is made.
2. Trace every feature to its source event and availability time.
3. Identify target-derived and post-outcome fields.
4. Audit joins and aggregation windows for future records.
5. Keep related entities and duplicates within valid split boundaries.
6. Fit imputers, encoders, selectors, and scalers only on training data.
7. Recompute features using historical point-in-time snapshots when possible.
8. Compare suspicious features through ablation.
9. Add automated leakage tests to the pipeline.

## Decision points
Exclude a feature when availability cannot be proven. A weaker honest model is preferable to a stronger leaked model.

## Common failure patterns
Full-dataset normalization, random temporal splits, future status fields, target encoding outside folds, and aggregates calculated after the prediction date.

## Verification
Perform lineage review, point-in-time tests, and a clean rebuild from raw historical data.

## Expected output
A leakage-safe dataset and documented availability contract for every feature family.

## Stop conditions
Stop model approval when feature timing or label construction cannot be established.