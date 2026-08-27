# Anomaly Detection

## Purpose
Detect unusual behavior that may indicate emerging fraud when confirmed labels are sparse or attacker behavior changes faster than supervised models can adapt.

## When to use
Use for novel-pattern discovery, weakly labeled domains, account takeover signals, merchant anomalies, or investigator prioritization. Do not equate anomaly with fraud.

## Inputs
Behavioral events, entity baselines, historical normal and suspicious periods, review capacity, and candidate anomaly features.

## Context to inspect
Inspect seasonality, customer lifecycle changes, regional patterns, product launches, known outages, data-quality issues, and existing supervised controls.

## Core knowledge
Useful anomalies are contextual. Global rarity may be harmless while deviation from an entity or peer baseline may be meaningful. Unsupervised scores require careful thresholding, explanation, and downstream validation.

## Procedure
1. Define the fraud hypothesis and modeled entity.
2. Establish normal behavior windows and peer groups.
3. Remove known operational artifacts and leakage.
4. Build robust deviation features.
5. Compare statistical, density, isolation, reconstruction, or sequence methods as appropriate.
6. Test stability across seasonality and traffic shifts.
7. Convert anomaly scores into reviewable signals rather than automatic fraud labels.
8. Sample high-scoring cases for investigator assessment.
9. Measure precision, novelty, overlap, and incremental loss capture.
10. Feed confirmed outcomes into supervised or rule controls.

## Decision points
Use simple robust statistics for transparent stable baselines. Use higher-dimensional methods only when interactions materially improve discovery.

## Common failure patterns
Treating every outlier as malicious; learning operational incidents as fraud; thresholding without review capacity; ignoring seasonality; no path from discovery to durable controls.

## Verification
Backtest known incidents, inspect score distributions, review top anomalies manually, and verify stability during benign traffic changes.

## Expected output
A monitored anomaly detector with defined context, threshold policy, review workflow, and evidence of incremental discovery value.

## Stop conditions
Stop if the baseline population is unstable or data-quality defects dominate the anomaly signal.