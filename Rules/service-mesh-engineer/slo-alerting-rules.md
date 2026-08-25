# SLO and Alerting
## Purpose
Tie mesh operations to user-visible reliability objectives.
## Scope
SLIs, SLOs, error budgets, alerts, synthetic checks, and mesh component health.
## MUST
- Alerts MUST correspond to actionable service or mesh failure conditions.
- Mesh changes affecting reliability MUST identify relevant SLOs and health gates.
- Critical certificate, control-plane, gateway, and configuration failures MUST have detection coverage.
## MUST NOT
- MUST NOT page solely on noisy low-signal proxy metrics without service impact or imminent risk.
- MUST NOT suppress alerts without documenting the underlying issue and duration.
- MUST NOT use averages alone for latency-sensitive SLO decisions.
## SHOULD
- Burn-rate or equivalent impact-aware alerting SHOULD be used for service objectives where practical.
## Exceptions
Alert suppression requires owner, expiry, and alternate monitoring.
## Verification
Review SLO definitions, alert tests, incident history, synthetic probes, and telemetry-to-action mapping.