# Incident and Emergency Release Rules

## Purpose
Enable urgent production changes without abandoning minimum controls needed to avoid amplifying an incident.

## Scope
Applies to hotfixes, security patches, incident mitigation releases, and other expedited production changes.

## MUST
- Emergency status MUST be tied to a concrete customer, security, availability, compliance, or business impact that cannot reasonably wait for the normal process.
- The expedited plan MUST retain minimum scope identification, accountable owners, risk assessment, validation, authorization, observability, and recovery controls.
- Emergency authority and any bypassed normal gates MUST be explicitly recorded before execution when circumstances permit.
- The smallest safe change SHOULD be selected to reduce diagnostic ambiguity and blast radius.
- A retrospective review MUST reconcile skipped evidence, temporary controls, documentation, and follow-up remediation.

## MUST NOT
- “Urgent” MUST NOT become a standing justification for bypassing ordinary release governance.
- Unrelated changes MUST NOT be bundled into an emergency release for convenience.
- An AI agent MUST NOT declare an emergency to expand its own execution authority.

## SHOULD
- Emergency paths SHOULD be rehearsed and use the same trusted delivery mechanisms as normal releases where possible.
- Temporary mitigations SHOULD have explicit owners and expiry/removal criteria.

## Exceptions
If immediate containment makes pre-execution documentation impossible, authorized responders may act within incident authority and record actions, evidence, risk, and approvals as soon as operationally safe.

## Verification
Inspect incident timeline, emergency justification, candidate scope, approvals, test/validation evidence, deployment logs, production telemetry, recovery readiness, and retrospective actions.