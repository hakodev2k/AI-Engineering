# Data Anomaly Detection

## Purpose
Detect unexpected changes in data populations when fixed rules cannot enumerate all plausible failures.

## When to use
Use for volume, distribution, cardinality, ratio, and behavioral shifts with enough history to establish expectations.

## Inputs
Historical metrics, seasonality, known incidents, business calendar, segmentation dimensions, and response tolerance.

## Preconditions
Ensure the monitored metric has stable meaning and sufficient historical coverage.

## Context to inspect
Inspect trends, periodicity, releases, campaigns, holidays, source changes, backfills, and legitimate structural breaks.

## Core knowledge
Anomaly detection identifies unusual behavior, not automatically bad data. Useful detectors optimize actionable precision and time-to-detection, not mathematical sophistication.

## Procedure
1. Select a quality-relevant metric tied to consumer impact.
2. Plot historical behavior and known incidents.
3. Segment only where segments have distinct behavior.
4. Establish a simple baseline first.
5. Model trend and seasonality where needed.
6. Define sensitivity and minimum materiality.
7. Backtest against historical normal periods and incidents.
8. Add contextual diagnostics to alerts.
9. Run in shadow mode before enforcement.
10. Measure precision, recall proxies, and alert burden.
11. Rebaseline explicitly after confirmed structural changes.

## Decision points
Prefer deterministic thresholds when business bounds exist. Use robust statistics for noisy distributions and more complex models only when they materially improve detection. Alert versus block based on confidence and blast radius.

## Common failure patterns
Treating every anomaly as a defect; training on contaminated history; excessive segmentation; ignoring seasonality; automatic rebaselining that learns incidents; thresholds optimized only for sensitivity.

## Verification
Backtests detect representative historical incidents without unacceptable false positives; live shadow runs produce actionable alerts; structural changes require controlled rebaseline.

## Expected output
A documented detector with metric definition, baseline, sensitivity, diagnostics, ownership, and measured operating characteristics.

## Stop conditions
Stop when history is insufficient, metric semantics changed silently, or anomaly output would trigger destructive automated action without validation.