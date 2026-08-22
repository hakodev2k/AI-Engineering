# Reliability and Operational Readiness

## Purpose
Ensure teams can operate what they ship and that reliability expectations are explicit, measurable, and proportionate to business impact.

## When to use
Use for service launches, major changes, recurring incidents, reliability planning, and operational reviews.

## Inputs
Service criticality, SLOs, architecture, dependency map, monitoring, runbooks, incident history, capacity data, and deployment strategy.

## Context to inspect
Inspect failure modes, alert quality, ownership, recovery procedures, backups, dependency behavior, capacity margins, and recent operational pain.

## Core knowledge
Reliability is a product property with cost trade-offs. SLOs and error budgets can connect user expectations to engineering investment. Operational readiness must be demonstrated, not asserted.

## Procedure
1. Classify service criticality and user impact.
2. Define measurable reliability objectives where appropriate.
3. Identify critical dependencies and failure modes.
4. Verify observability covers user-impacting failures.
5. Validate capacity, timeouts, retries, degradation, and recovery paths.
6. Confirm on-call ownership and escalation.
7. Test runbooks, backups, rollback, and disaster scenarios proportionate to risk.
8. Review recent incidents for unresolved systemic issues.
9. Gate launch on material readiness criteria.
10. Track reliability after release and adjust investment based on evidence.

## Decision points
Invest more in resilience for high-impact services; accept simpler controls for low-criticality systems when failure is cheap and recoverable.

## Common failure patterns
Monitoring infrastructure instead of user outcomes, noisy alerts, untested backups, no rollback path, reliability goals without ownership, and shipping operational burden to another team.

## Verification
Verify critical alerts are actionable, recovery paths are tested, ownership is explicit, objectives are measurable, and known high-severity gaps are resolved or accepted.

## Expected output
An operational-readiness assessment with reliability targets, gaps, owners, and launch or remediation decisions.

## Stop conditions
Block or escalate when critical recovery controls are untested, severe known risks lack acceptance, or no team can safely operate the service.