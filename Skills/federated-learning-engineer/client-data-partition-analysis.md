# Client Data Partition Analysis

## Purpose
Characterize how training data is distributed across clients so algorithm, sampling, evaluation, and fairness decisions reflect real federated conditions.

## When to use
Use before training, after onboarding a new client population, or when convergence and per-client quality are unstable.

## Inputs
Client-level sample counts, labels or targets, feature distributions, timestamps, device/site metadata, and privacy-safe aggregate statistics.

## Context to inspect
Inspect non-IID structure, class imbalance, temporal drift, client size skew, missing features, sparsity, correlation with client type, and whether local preprocessing differs.

## Core knowledge
Federated data is often non-identically distributed by quantity, label, feature, concept, and time. Aggregate statistics can hide severe local divergence. Analysis must respect privacy constraints and avoid reconstructing sensitive client data.

## Procedure
1. Define privacy-safe statistics that may leave clients.
2. Measure client sample-count distribution.
3. Compare label/target prevalence across clients.
4. Quantify feature and representation shift using approved summaries.
5. Separate temporal drift from structural heterogeneity.
6. Detect outlier clients and dominant large clients.
7. Group clients into meaningful cohorts where justified.
8. Compare train/evaluation client populations.
9. Document implications for sampling, aggregation, and personalization.
10. Re-run analysis periodically for drift.

## Decision points
Use cohort-aware metrics when global averages hide meaningful segments. Prefer robust summaries over raw client-level exports when privacy risk is material. Do not force homogeneous preprocessing if local domains legitimately differ.

## Common failure patterns
- Assuming IID data.
- Looking only at global class balance.
- Leaking sensitive client statistics.
- Confusing client-size imbalance with distribution shift.
- Ignoring time-dependent drift.

## Verification
Verify the analysis explains observed convergence or quality differences and that all exported statistics comply with the defined privacy boundary.

## Expected output
A privacy-safe heterogeneity report with client cohorts, skew measures, drift indicators, and design implications.

## Stop conditions
Stop if required statistics violate policy, client identity semantics are unclear, or data instrumentation is too incomplete to support conclusions.