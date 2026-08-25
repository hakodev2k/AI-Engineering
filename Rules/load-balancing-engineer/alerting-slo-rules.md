# Alerting and SLO Rules

## Purpose
Align traffic-tier alerts with user impact and reliability objectives.

## Scope
SLIs, SLOs, burn-rate alerts, health alerts, capacity alerts, and paging policy.

## MUST
- Critical traffic services MUST define measurable availability and latency indicators aligned with user-visible outcomes.
- Paging alerts MUST correspond to actionable conditions requiring timely human response.
- Backend health alerts MUST avoid paging solely on harmless single-instance churn when redundancy remains healthy.
- Capacity alerts MUST provide enough lead time to act before hard saturation.
- Alert thresholds and routing MUST be reviewed after significant architecture or traffic changes.

## MUST NOT
- MUST NOT page on every transient health-check failure.
- MUST NOT suppress recurring alerts without resolving, accepting, or explicitly tracking the underlying risk.
- MUST NOT define reliability solely from load-balancer uptime when users can still receive failed requests.

## SHOULD
- Prefer multi-window burn-rate alerting for SLO-driven services.
- Separate informational anomaly detection from urgent paging.

## Exceptions
Temporary alert suppression requires owner, reason, expiry, and compensating monitoring.

## Verification
Review SLI queries, alert history, false-positive rates, paging actions, capacity lead time, and incident correlation.