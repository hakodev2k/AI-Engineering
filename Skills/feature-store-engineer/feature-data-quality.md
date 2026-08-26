# Feature Data Quality

## Purpose
Create data-quality controls that catch feature defects before they contaminate training or serving.

## When to use
Use when onboarding features, defining release gates or investigating anomalous model inputs.

## Inputs
Feature contracts, historical distributions, source expectations, domain constraints and consumer criticality.

## Context to inspect
Null rates, ranges, categories, freshness, volume, uniqueness, source incidents and prior model failures.

## Core knowledge
Quality checks should target semantic invariants and failure modes, not arbitrary thresholds. Baselines need segmentation and seasonality awareness.

## Procedure
1. Classify feature criticality.
2. Define hard invariants from the contract.
3. Establish distribution and freshness baselines.
4. Add null, range, category, volume and key-integrity checks as relevant.
5. Segment checks where populations differ materially.
6. Define warn, quarantine and fail actions.
7. Test checks against known bad data.
8. Route alerts to accountable owners.
9. Track false positives and missed incidents.
10. Review thresholds after legitimate product/data shifts.

## Decision points
Use hard failure for impossible states and high-impact corruption; alerts for uncertain drift. Prefer robust statistics over brittle fixed thresholds when distributions evolve.

## Common failure patterns
Checks without action, global thresholds hiding segment failures, alert fatigue, validating after publication and silently coercing invalid values.

## Verification
Inject representative defects and prove they are detected before consumer exposure with actionable diagnostics.

## Expected output
A risk-based feature quality suite tied to publication controls.

## Stop conditions
Stop if no owner can adjudicate semantic anomalies or if blocking thresholds lack enough evidence.