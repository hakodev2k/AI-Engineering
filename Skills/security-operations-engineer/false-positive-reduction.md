# False Positive Reduction

## Purpose
Reduce alert noise without creating dangerous blind spots or encoding undocumented exceptions.

## When to use
Use when a detection has high benign volume, analyst fatigue or repeated known-good patterns.

## Inputs
Alert history, dispositions, rule logic, entity context, benign workflows, baseline metrics and coverage objective.

## Context to inspect
Review true-positive examples, telemetry changes, analyst consistency, suppression rules and whether the alert is actionable.

## Core knowledge
Noise can come from bad logic, poor context, unstable baselines or inappropriate severity. Suppression is the last step, not the first.

## Procedure
1. Quantify volume and disposition quality.
2. Cluster false positives by root cause.
3. Validate labels with representative cases.
4. Improve entity context and rule predicates.
5. Separate distinct behaviors into different detections when response differs.
6. Add narrow exclusions only for verified benign invariants.
7. Time-bound risky exceptions.
8. Backtest tuned logic against true positives and historical data.
9. Deploy gradually.
10. Monitor precision, recall proxies and missed-incident feedback.

## Decision points
Raise threshold only when risk semantics remain valid. Suppress known automation by stable identity and behavior rather than fragile hostnames when possible.

## Common failure patterns
Whitelisting entire admin groups; excluding common tools globally; tuning from a tiny window; optimizing alert count instead of detection value.

## Verification
Demonstrate reduced benign volume while preserving known malicious/test cases and documenting residual coverage.

## Expected output
Tuned detection with measured before/after performance and justified exclusions.

## Stop conditions
Stop if true-positive corpus is insufficient, labels are unreliable or tuning would materially reduce high-risk coverage.