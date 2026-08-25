# Problem Framing and Success Metrics

## Purpose
Turn a business problem into a measurable ML problem with explicit constraints and a defensible success criterion.

## When to use
Use before dataset construction, model selection, or major retraining. Do not use ML when deterministic rules satisfy the requirement more safely or cheaply.

## Inputs
Business objective, users, decisions/actions, constraints, baseline, costs of errors, latency and compliance requirements.

## Context to inspect
Existing workflow, historical decisions, available signals, data latency, current baseline, downstream consumers, operational constraints.

## Core knowledge
A model metric is a proxy, not the product objective. Class imbalance, asymmetric error costs, delayed labels, selection bias and distribution shift can make apparently strong offline metrics misleading.

## Procedure
1. Define the decision the model will support.
2. Identify prediction target, unit of prediction and prediction horizon.
3. Establish a non-ML or incumbent baseline.
4. Map false positives, false negatives and abstentions to business cost.
5. Choose offline metrics aligned with those costs.
6. Define slices where performance must be measured separately.
7. Specify latency, throughput, freshness, explainability, privacy and cost constraints.
8. Define online/product metrics and guardrails.
9. Write acceptance thresholds and rollback criteria before experimentation.
10. Confirm labels can be obtained without leakage.

## Decision points
Prefer ranking metrics for ranking decisions, calibrated probabilities for risk decisions, and cost-weighted metrics when errors are asymmetric. Add human review when uncertainty or impact is high.

## Common failure patterns
Optimizing accuracy on imbalanced data; predicting a convenient proxy instead of the real outcome; leakage; no baseline; undefined production guardrails; metrics averaged across harmful slices.

## Verification
Confirm metric definitions with stakeholders, reproduce the baseline, test label availability and verify acceptance thresholds are computable from production telemetry.

## Expected output
A concise ML problem specification containing target, baseline, metrics, constraints, slices, acceptance criteria and rollback conditions.

## Stop conditions
Stop if the target is undefined, labels are fundamentally unavailable, the proposed use is prohibited, or success cannot be measured.