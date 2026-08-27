# Incident and Emergency Change Rules

## Purpose
Enable rapid network recovery without abandoning authority, evidence, or blast-radius control.

## Scope
Incident remediation, emergency isolation, emergency routing/policy changes, and degraded-mode automation.

## MUST
- Emergency automation MUST identify the incident context, authorized decision maker, exact targets, and intended outcome.
- Emergency scope MUST be the smallest practical set capable of mitigating the incident.
- Preconditions that remain relevant to preventing catastrophic failure MUST still run.
- Every emergency mutation MUST capture what changed and verify the mitigation outcome.
- Temporary emergency state MUST have an owner and explicit reconciliation or rollback action.

## MUST NOT
- MUST NOT use emergency status as blanket authorization to disable authentication, audit, target validation, or secret protections.
- MUST NOT broaden changes beyond the incident objective without separate authorization.
- MUST NOT leave temporary routing, ACL, or management exceptions untracked after stabilization.

## SHOULD
- Pre-approved emergency runbooks SHOULD exist for recurring high-severity scenarios.
- Automation SHOULD support read-only diagnostics independently from mutation authority.

## Exceptions
When normal telemetry or management paths are unavailable, use the safest available alternate evidence and record the gap for retrospective review.

## Verification
Inspect incident linkage, approvals, target resolution, emergency audit records, post-change evidence, temporary-state cleanup, and retrospective reconciliation.