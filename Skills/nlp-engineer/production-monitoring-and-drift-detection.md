# Production Monitoring and Drift Detection

## Purpose
Monitor NLP systems for quality degradation, input drift, language/domain shifts, latency regressions, and abnormal output behavior after deployment.

## When to use
Use for production models, post-launch health reviews, model refresh planning, or suspected quality incidents.

## Inputs
Production logs/metrics, model version, benchmark, traffic metadata, feedback signals, SLOs, privacy constraints.

## Preconditions
Observable model inputs/outputs or derived safe telemetry exist.

## Context to inspect
Input lengths, language/domain mix, confidence distributions, retrieval quality, output rates, latency, error codes, feedback, release history.

## Core knowledge
Ground-truth labels are often delayed or sparse in NLP. Monitoring therefore combines direct performance labels with proxy signals, distribution shifts, calibration changes, and sampled human review.

## Procedure
1. Define operational and quality indicators before launch.
2. Segment metrics by model version, language, domain, and critical cohort.
3. Track input/output length, confidence, abstention, and error distributions.
4. Detect shifts relative to stable reference windows.
5. Add delayed-label quality metrics where available.
6. Sample outputs for human review using risk-weighted criteria.
7. Correlate drift with upstream data, product, or model changes.
8. Define alert thresholds based on actionable impact.
9. Maintain rollback and retraining triggers.
10. Feed confirmed production failures into regression datasets.

## Decision points
Use statistical drift metrics as investigation signals, not proof of quality loss. Retrain only when drift causes meaningful task degradation or changing requirements.

## Common failure patterns
Monitoring only uptime, logging sensitive raw text unnecessarily, alerting on harmless seasonal changes, no slice-level metrics, and retraining automatically on unverified drift.

## Verification
Alerts fire on injected regressions, dashboards preserve slice visibility, privacy controls are validated, and rollback/retraining triggers are actionable.

## Expected output
Monitoring specification, dashboards, alert thresholds, review sampling policy, and model-refresh criteria.

## Stop conditions
Stop when monitoring requires prohibited data collection or available telemetry cannot distinguish model from upstream failures.