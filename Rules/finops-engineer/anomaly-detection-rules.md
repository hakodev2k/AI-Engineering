# Cost Anomaly Detection Rules

## Purpose
Detect abnormal spend early and route it to accountable responders with useful evidence.

## Scope
Cloud services, accounts, projects, SaaS, marketplace, data transfer, and commitment-related costs.

## MUST
- Define anomaly baselines, sensitivity, materiality thresholds, ownership routing, and response expectations.
- Include cost dimension, magnitude, start time, likely drivers, and comparison baseline in investigations.
- Distinguish legitimate growth, delayed billing, pricing changes, and operational incidents.
- Track anomalies through disposition and quantify avoidable impact when practical.

## MUST NOT
- Suppress recurring alerts without identifying and documenting their cause.
- Assume every cost spike is waste.
- Auto-delete or disable production resources solely from anomaly detection without an authorized safety workflow.

## SHOULD
- Correlate anomalies with deployments, scaling events, usage, account changes, and provider notices.

## Exceptions
Low-value noise may be aggregated or suppressed when thresholds and rationale are reviewed periodically.

## Verification
Review detector configuration, alert delivery, investigation evidence, false-positive trends, response times, and closed-anomaly outcomes.