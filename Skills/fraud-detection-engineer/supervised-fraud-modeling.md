# Supervised Fraud Modeling

## Purpose
Build supervised fraud models that optimize operational value under severe class imbalance, delayed labels, asymmetric costs, and adversarial change.

## When to use
Use when sufficient labeled history exists and model-based ranking can improve on deterministic rules. Do not treat standard accuracy as a meaningful objective.

## Inputs
- Point-in-time training data
- Fraud labels and label timestamps
- Candidate features
- Cost assumptions
- Serving constraints

## Context to inspect
Inspect class balance, label maturity, sampling policy, train/test split logic, feature availability, fraud-type distribution, temporal drift, and current baseline controls.

## Core knowledge
Temporal validation is usually more realistic than random splitting. Precision, recall, PR-AUC, expected loss, capture at review capacity, and calibration are more useful than raw accuracy. Sampling changes class priors and may require probability correction.

## Procedure
1. Define target outcome and label-maturity window.
2. Build point-in-time correct training examples.
3. Split data temporally and preserve realistic future conditions.
4. Establish rule and heuristic baselines.
5. Train interpretable baseline models before adding complexity.
6. Address imbalance through weighting or sampling without corrupting evaluation priors.
7. Tune against business-aware metrics.
8. Evaluate by fraud type, channel, amount, geography, and customer cohorts.
9. Test calibration and threshold sensitivity.
10. Package model, feature contract, version, and rollback criteria.

## Decision points
Prefer simpler models when latency, stability, explainability, or sparse labels dominate. Adopt more complex models only with robust out-of-time lift and manageable operations.

## Common failure patterns
- Random train/test leakage
- Optimizing ROC-AUC alone
- Evaluating on artificially balanced data
- Ignoring calibration
- Selecting complexity from tiny offline gains

## Verification
Perform out-of-time testing, calibration checks, slice analysis, replay testing, and shadow evaluation against current decisions.

## Expected output
A versioned model with reproducible training data, evaluation evidence, threshold guidance, and serving requirements.

## Stop conditions
Stop when labels are too immature, leakage cannot be excluded, or no stable out-of-time lift exists.