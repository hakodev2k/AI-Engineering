# Error Budget Rules

## Purpose
Use tolerated unreliability as an explicit control for balancing delivery velocity with production risk.

## Scope
Applies to APIs with defined SLOs and teams making release, remediation, or capacity decisions.

## MUST
- Error budgets MUST be calculated from the approved SLO and the same authoritative SLI data used for compliance reporting.
- Material budget burn MUST trigger an explicit decision about releases, remediation, or risk acceptance.
- Budget policy MUST define burn thresholds, decision owners, escalation paths, and conditions for resuming normal change velocity.
- Reliability work caused by budget exhaustion MUST target evidenced contributors to user-visible failure.

## MUST NOT
- MUST NOT treat unused error budget as permission to intentionally degrade service.
- MUST NOT hide budget exhaustion by changing windows, exclusions, or targets without review.
- MUST NOT continue high-risk releases during sustained severe burn without accountable human approval.

## SHOULD
- Budget reporting SHOULD separate chronic degradation from acute incidents.
- Teams SHOULD use multiple burn-rate horizons to distinguish fast outages from slow erosion.

## Exceptions
A temporary policy exception requires reason, duration, expected user impact, evidence, compensating controls, rollback criteria, accountable approver, and follow-up review.

## Verification
Inspect SLO definitions, budget calculations, release records, incident timelines, exception records, and remediation work. Confirm budget arithmetic from raw or independently queried telemetry.