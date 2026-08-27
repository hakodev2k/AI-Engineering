# Alerting Rules

## Purpose
Page humans for actionable threats to API reliability while minimizing noise and delayed detection.

## Scope
Applies to paging, ticketing, anomaly alerts, burn-rate alerts, and alert routing.

## MUST
- Paging alerts MUST correspond to urgent, actionable conditions with material user or error-budget impact.
- Every page MUST identify service, symptom, severity, ownership, and a useful investigation entry point.
- Alert thresholds MUST be validated against historical behavior or controlled tests.
- Alert routing and escalation MUST have an accountable owner and periodic verification.
- Sustained noisy alerts MUST be corrected rather than normalized.

## MUST NOT
- MUST NOT page solely on low-level resource thresholds when no actionable reliability risk is established.
- MUST NOT suppress recurring alerts without documenting the underlying risk and follow-up.
- MUST NOT depend on a single alert channel for critical incidents without an accepted failure mode.

## SHOULD
- Multi-window error-budget burn alerts SHOULD be preferred for SLO-backed paging.
- Nonurgent capacity and trend signals SHOULD route to planned work rather than paging.

## Exceptions
Exceptions require reason, duration, alternate detection path, owner, and review.

## Verification
Review alert rules, paging history, false-positive/false-negative incidents, escalation tests, runbooks, and SLO correlation.