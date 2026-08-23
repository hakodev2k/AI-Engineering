# Cross Validation and Splitting

## Purpose
Design data partitions that estimate future performance without leakage and reflect how predictions will actually be used.

## When to use
Use before feature selection, hyperparameter tuning, model comparison, and final evaluation.

## Inputs
Dataset, entity identifiers, timestamps, target, deployment scenario, and tuning plan.

## Context to inspect
Repeated entities, temporal dependence, groups, geography, label horizon, duplicates, and preprocessing pipeline.

## Core knowledge
Random splits are invalid when future information, repeated entities, or correlated groups cross boundaries. Cross-validation must reproduce the independence assumptions of deployment.

## Procedure
1. Define the future scoring scenario.
2. Identify leakage boundaries: time, entity, group, site, or event.
3. Reserve a final holdout before iterative modeling.
4. Choose random, stratified, grouped, temporal, or nested validation accordingly.
5. Fit preprocessing within each training fold only.
6. Keep feature selection and tuning inside validation loops.
7. Check class and cohort coverage across folds.
8. Measure fold variance and investigate instability.
9. Version split logic and seeds where applicable.

## Decision points
Use grouped splits for correlated entities, temporal splits for forecasting or evolving systems, and nested validation when unbiased comparison after substantial tuning matters.

## Common failure patterns
Duplicate leakage, preprocessing before splitting, random splits for time-dependent data, repeated test-set inspection, and selecting a favorable seed.

## Verification
Audit representative rows across partitions and confirm no forbidden entity, temporal, or transformation information crosses boundaries.

## Expected output
A reproducible split strategy aligned with deployment and a protected final evaluation set.

## Stop conditions
Stop when entity identity, timestamps, or other required leakage controls are unavailable.