# Federated Evaluation

## Purpose
Evaluate global and personalized models across decentralized clients without relying on a misleading single aggregate metric.

## When to use
Use before promoting a model, comparing FL algorithms, investigating cohort regressions, or validating personalization.

## Inputs
Candidate model, client evaluation data, cohort definitions, metric specification, participation policy, centralized reference sets if allowed, and privacy constraints.

## Context to inspect
Inspect whether evaluation clients match deployment, client sample-size skew, metric aggregation semantics, local data freshness, and privacy rules for metric export.

## Core knowledge
Federated evaluation must distinguish sample-weighted global performance, client-weighted performance, tail distributions, and cohort outcomes. Aggregate averages can hide severe client regressions.

## Procedure
1. Define task metrics and acceptance thresholds before evaluating.
2. Freeze the candidate model/version.
3. Select an evaluation client population separately from training where possible.
4. Compute approved local metrics without exporting raw examples.
5. Aggregate both sample-weighted and client-weighted results when meaningful.
6. Report percentile and worst-cohort behavior.
7. Compare against the current production model and simple baselines.
8. Estimate uncertainty across clients and repeated samples.
9. Test under realistic missing-client and availability patterns.
10. Archive metric definitions, model version, and client-selection policy.

## Decision points
Use centralized test sets only as supplemental evidence when deployment distributions are federated. Prefer robust/tail metrics when client experience matters independently of data volume.

## Common failure patterns
- Reporting only micro-average accuracy.
- Evaluating on training participants only.
- Mixing incompatible metric versions.
- Ignoring small-client variance.
- Exporting overly detailed local metrics that leak information.

## Verification
Reproduce aggregate metrics from the same model/version, validate metric code locally, and confirm promotion criteria across global, cohort, and tail views.

## Expected output
A reproducible federated evaluation report with baselines, uncertainty, cohort/tail metrics, and promotion recommendation.

## Stop conditions
Stop if evaluation population is undefined, metric semantics differ across clients, or privacy policy forbids required aggregation without an approved alternative.