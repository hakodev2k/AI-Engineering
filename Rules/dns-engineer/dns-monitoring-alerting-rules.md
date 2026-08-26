# DNS Monitoring and Alerting Rules

## Purpose
Detect actionable DNS degradation before it becomes prolonged outage.

## Scope
Service health, zone correctness, DNSSEC, delegation, capacity, and alert routing.

## MUST
- Alerts MUST correspond to user-impact risk or an actionable precursor with a defined response.
- Critical zones MUST be monitored for resolution success, authoritative reachability, and unexpected answer changes.
- DNSSEC zones MUST alert before signature or key lifecycle conditions can cause validation failure.

## MUST NOT
- MUST NOT suppress recurring alerts without resolving, accepting, or explicitly tracking the underlying risk.
- MUST NOT page on noisy signals lacking an actionable response.

## SHOULD
- Alert thresholds SHOULD use baselines and SLOs rather than arbitrary values where feasible.

## Exceptions
Temporary suppression requires owner, reason, expiry, and alternate monitoring.

## Verification
Review alert rules, run controlled fault tests, inspect routing, and confirm runbooks match triggered conditions.