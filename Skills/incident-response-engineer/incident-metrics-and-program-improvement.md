# Incident Metrics and Program Improvement

## Purpose
Use incident data to improve response capability, reliability investment, and organizational learning without incentivizing metric gaming.

## When to use
Use when reviewing incident-response effectiveness across multiple incidents or planning reliability improvements.

## Inputs
Incident records, detection times, acknowledgment times, mitigation/recovery times, severity, recurrence, action completion, paging data, and customer impact.

## Context to inspect
Inspect measurement definitions, missing incidents, severity changes, service criticality, alerting maturity, and organizational changes that affect comparability.

## Core knowledge
Metrics such as MTTD and MTTR are useful only with consistent definitions and context. Distribution and severity segmentation are often more informative than averages. The goal is improved outcomes, not lower numbers at any cost.

## Procedure
1. Define each metric and timestamp source consistently.
2. Segment incidents by severity, service, failure class, and detection source.
3. Review distributions and outliers rather than averages alone.
4. Track recurrence and repeated contributing factors.
5. Measure corrective-action completion and effectiveness.
6. Analyze paging load, false positives, and escalation delays.
7. Identify systemic bottlenecks in detection, diagnosis, mitigation, or recovery.
8. Select a small number of improvement initiatives tied to evidence.
9. Re-measure after changes and compare like-for-like populations.
10. Retire metrics that create harmful incentives or no longer guide decisions.

## Decision points
Use quantitative metrics for trends and qualitative review for context. Avoid cross-team ranking when service risk and incident definitions differ materially.

## Common failure patterns
Optimizing MTTR by closing incidents early, averaging incomparable severities, counting only declared incidents, and measuring action completion without effectiveness.

## Verification
Confirm metric definitions are reproducible, source data is traceable, and proposed improvements correspond to observed response bottlenecks.

## Expected output
A response-program assessment with evidence-based trends, recurring risks, and prioritized improvement initiatives.

## Stop conditions
Escalate when metrics are being used for inappropriate individual performance evaluation or data quality cannot support the claimed conclusions.