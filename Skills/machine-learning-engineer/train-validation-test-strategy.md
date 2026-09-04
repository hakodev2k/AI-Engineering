# Train Validation Test Strategy

## Purpose
Create evaluation splits that estimate real-world generalization without contamination, distribution mismatch, or repeated tuning against the final test set.

## When to use
Use when creating a new dataset, changing sampling logic, handling temporal or grouped data, or diagnosing offline-to-production gaps.

## Inputs
- Dataset and entity keys
- Timestamps
- Deployment scenario
- Label prevalence
- Expected future distribution

## Context to inspect
Inspect repeated entities, temporal order, geography, cohorts, interventions, data collection changes, and dependencies among records.

## Core knowledge
Split strategy must simulate deployment. Random IID splits are invalid when future prediction, grouped entities, repeated measurements, or domain shifts matter. Validation drives iteration; test data must remain untouched until final assessment.

## Procedure
1. Describe the exact production prediction scenario.
2. Identify dependency boundaries: user, device, account, site, session, time, or source.
3. Choose temporal, grouped, stratified, domain-held-out, or combined splitting accordingly.
4. Freeze a final test set before model iteration.
5. Ensure preprocessing and resampling are fit within training folds only.
6. Check target and feature distributions across splits.
7. Validate that no entity-level duplicates cross boundaries.
8. Use cross-validation only when it matches dependency structure.
9. Track every evaluation against the validation set.
10. Reserve the test set for final model-selection confirmation.

## Decision points
Use rolling or forward validation for time-dependent systems, grouped folds for entity dependence, and domain holdouts when deployment includes unseen sites or customers. Prefer a simpler split that faithfully matches production over statistically convenient random folds.

## Common failure patterns
- Reusing test results for tuning.
- Random splitting time-series records.
- Duplicate users across splits.
- Oversampling before splitting.
- Different preprocessing fit rules between experimentation and production.

## Verification
Verify no cross-split dependency violations, realistic time ordering, stable split manifests, and reproducible metrics from frozen data identifiers.

## Expected output
A documented split policy, reproducible split manifest/code, rationale, and contamination checks.

## Stop conditions
Stop if entity identity or timestamp semantics are insufficient to enforce independence, or if the proposed split cannot approximate deployment.