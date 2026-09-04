# Problem Framing and Baselines

## Purpose
Convert an ambiguous business or product objective into a measurable machine-learning problem, and establish baselines that prove whether ML adds value.

## When to use
Use before starting a new ML initiative, when a project has unclear success criteria, or when model work is disconnected from business outcomes. Do not begin model tuning before this framing is stable.

## Inputs
- Business objective and user workflow
- Available data and labels
- Decision latency and cost constraints
- Error-cost asymmetry
- Existing rule-based or statistical systems

## Context to inspect
Inspect how predictions are consumed, what decisions follow, historical performance, data availability at prediction time, operational constraints, and failure consequences.

## Core knowledge
A Senior ML Engineer distinguishes prediction quality from product value. Problem type, target definition, evaluation metric, decision threshold, label delay, class imbalance, and serving constraints must align. A trivial baseline is often the fastest way to expose weak problem formulation.

## Procedure
1. Define the user or system decision the model will support.
2. Specify target, prediction unit, horizon, and available-at-inference features.
3. Identify leakage risks and label-generation assumptions.
4. Quantify costs of false positives, false negatives, abstention, and latency.
5. Select offline metrics tied to operational decisions.
6. Build naive, heuristic, and simple statistical baselines.
7. Define minimum acceptable lift over baseline.
8. Specify deployment and monitoring constraints.
9. Document assumptions and unresolved dependencies.
10. Obtain stakeholder agreement on success and stop criteria before advanced modeling.

## Decision points
Use classification, regression, ranking, forecasting, anomaly detection, retrieval, or optimization according to the decision structure rather than team preference. Prefer rules when behavior is deterministic and stable. Prefer simple models when interpretability, latency, or limited data dominate.

## Common failure patterns
- Predicting an easy proxy instead of the real outcome.
- Using features unavailable at inference time.
- Optimizing aggregate metrics that hide critical segments.
- No non-ML baseline.
- Ignoring label delay or intervention effects.

## Verification
Verify that a reproducible baseline exists, metrics reflect decision costs, features are inference-safe, and stakeholders can explain what improvement would justify deployment.

## Expected output
A concise ML problem specification with target, unit, horizon, features, metrics, baseline, constraints, risks, and acceptance threshold.

## Stop conditions
Stop if labels are invalid, the target cannot be measured, inference inputs are unavailable, or a simpler non-ML solution already satisfies requirements.