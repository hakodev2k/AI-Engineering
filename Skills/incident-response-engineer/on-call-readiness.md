# On-Call Readiness

## Purpose
Prepare responders, systems, and operational knowledge so incidents can be detected, understood, escalated, and mitigated without avoidable delay.

## When to use
Use when establishing or reviewing an on-call function, onboarding responders, or after incidents expose readiness gaps.

## Inputs
Service inventory, ownership, alert routes, runbooks, access model, escalation paths, dashboards, dependencies, and recent incident history.

## Context to inspect
Inspect paging coverage, privileged-access procedures, environment access, stale runbooks, alert quality, support contacts, and responder workload.

## Core knowledge
Readiness is a system property. A skilled responder without access, context, usable alerts, or escalation paths is not operationally ready.

## Procedure
1. Inventory services and accountable owners.
2. Verify paging routes and backup escalation.
3. Confirm responders can access required dashboards, logs, deployment history, and safe mitigation controls.
4. Review top failure modes and corresponding runbooks.
5. Test critical access before emergencies.
6. Ensure alerts contain actionable context and links.
7. Document dependency and vendor escalation paths.
8. Run tabletop or game-day exercises for high-risk scenarios.
9. Measure page volume, false positives, response latency, and unresolved toil.
10. Address readiness gaps with owners and deadlines.

## Decision points
Automate routine diagnosis when stable and safe; retain human decision points for high-impact or ambiguous actions. Reduce paging when signals are not actionable.

## Common failure patterns
Granting access only during incidents, stale contact lists, excessive noisy alerts, tribal knowledge, untested runbooks, and unsustainable on-call load.

## Verification
Run a readiness exercise demonstrating that a responder can receive a page, find context, escalate, and execute a safe mitigation path.

## Expected output
A readiness assessment with verified access, ownership, runbook coverage, alert quality, and prioritized gaps.

## Stop conditions
Escalate when required emergency access conflicts with security policy or staffing cannot provide safe coverage.