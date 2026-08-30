# Data Quality Controls

## Purpose
Establish measurable data quality controls that detect correctness, completeness, freshness, validity, and consistency failures before they become business incidents.

## When to use
Use for critical warehouse datasets, new sources, recurring data incidents, or datasets with regulatory or financial impact.

## Inputs
Business rules, source SLAs, historical incidents, model dependencies, consumer criticality, expected volumes and distributions.

## Context to inspect
Current checks, alert routing, source quality, lineage, freshness behavior, acceptable nulls, duplicates, and known seasonal patterns.

## Core knowledge
Data quality is contextual. Thresholds should reflect business risk and normal variability. Checks must distinguish source defects from transformation defects and should produce actionable evidence rather than noise.

## Procedure
1. Rank datasets by business criticality.
2. Define quality dimensions and owners.
3. Encode deterministic invariants first.
4. Add freshness and volume expectations.
5. Add distribution or anomaly checks where useful.
6. Define severity and response thresholds.
7. Route alerts to accountable owners with context.
8. Quarantine or block publication for critical failures when appropriate.
9. Record incidents and recurring causes.
10. Tune thresholds based on evidence without masking defects.

## Decision points
Use hard failures for invariant violations that make data unsafe. Use anomaly alerts for probabilistic signals. Quarantine when downstream harm exceeds availability impact.

## Common failure patterns
Alert fatigue, arbitrary thresholds, checks without owners, validating after publication, and treating source corruption as acceptable because pipelines succeeded.

## Verification
Inject representative defects, confirm detection and routing, and measure false-positive and missed-defect rates over time.

## Expected output
A prioritized quality control system with thresholds, ownership, escalation, and evidence.

## Stop conditions
Stop publication when critical quality gates fail and correctness cannot be established.