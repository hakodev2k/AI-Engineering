# Dataset Splitting and Leakage Prevention

## Purpose
Design evaluation splits that estimate future production performance without contamination.

## When to use
Use before feature/model experimentation and whenever prediction timing, entities or data generation change.

## Inputs
Prediction timestamp, entity identifiers, label horizon, feature availability times and dataset history.

## Context to inspect
Repeated entities, temporal dependence, groups, preprocessing stages, feature computation windows and label construction.

## Core knowledge
Random splits are invalid when observations are temporally or group dependent. Leakage includes target-derived features, future information and preprocessing fitted across evaluation boundaries.

## Procedure
1. Define the exact prediction-time information boundary.
2. Map each feature to its availability timestamp.
3. Identify entity/group dependencies.
4. Choose random, grouped, temporal or rolling splits to mirror deployment.
5. Keep final test data isolated from iterative tuning.
6. Fit imputers, encoders and scalers only on training folds.
7. Audit features for direct and indirect target leakage.
8. Simulate delayed labels and production cutoff behavior.
9. Compare split distributions and sample counts.
10. Document split logic as executable code.

## Decision points
Use temporal splits for future prediction, grouped splits where entities repeat, and nested cross-validation when unbiased model-selection estimates matter and data is limited.

## Common failure patterns
Randomly splitting time series; same customer in train and test; target encoding before splitting; future aggregates; tuning repeatedly against the test set.

## Verification
Rebuild splits deterministically, assert non-overlap of forbidden groups/times, and independently inspect suspicious high-performing features.

## Expected output
Reproducible split definitions plus leakage audit evidence.

## Stop conditions
Stop evaluation if prediction-time availability is unknown or leakage cannot be excluded.