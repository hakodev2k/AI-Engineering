# Data and Concept Drift

## Purpose
Detect, interpret, and respond to meaningful changes in production data distributions or the relationship between inputs and outcomes.

## When to use
Use for models exposed to evolving populations, markets, sensors, content, policies, or upstream pipelines.

## Inputs
Reference datasets, live feature/output distributions, labels when available, slice definitions, retraining policy, business context.

## Preconditions
Reference periods and feature semantics are stable enough for comparison.

## Context to inspect
Feature pipelines, model monitoring, seasonality, product launches, upstream schema changes, feedback loops, and label delays.

## Core knowledge
Covariate drift does not always imply quality loss; concept drift may require labels; thresholds should reflect business sensitivity and natural variation. Seasonality and pipeline defects can mimic drift.

## Procedure
1. Define reference windows by valid operating regime.
2. Select statistically and operationally meaningful drift metrics.
3. Monitor critical features and slices.
4. Correlate drift with quality/business metrics.
5. Rule out instrumentation and pipeline defects.
6. Account for seasonality and planned product changes.
7. Classify severity and likely cause.
8. Choose observe, retrain, recalibrate, rollback, or redesign.
9. Validate any retraining on current and historical regimes.
10. Record drift episodes and outcomes.

## Decision points
Automatic retraining only for bounded, well-understood systems; human review for high-impact or ambiguous shifts.

## Common failure patterns
Retraining on every statistical alert, comparing incompatible windows, ignoring label shift, reference contamination, and feedback loops caused by model decisions.

## Verification
Replay known drift events and confirm detection sensitivity, false-positive rate, and response workflow.

## Expected output
Drift policy, metrics, thresholds, diagnosis procedure, retraining criteria, and incident records.

## Stop conditions
Stop automated action when drift cause is unknown, labels are unreliable, or retraining could amplify harmful feedback.