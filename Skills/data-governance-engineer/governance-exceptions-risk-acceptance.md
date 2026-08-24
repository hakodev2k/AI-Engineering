# Governance Exceptions and Risk Acceptance

## Purpose
Manage temporary deviations from data policy transparently, proportionately, and with accountable risk acceptance.

## When to use
Use when mandatory controls cannot be met immediately, migrations require temporary deviation, or business needs justify bounded exceptions.

## Inputs
Policy requirement, risk assessment, affected data/assets, compensating controls, requested duration, remediation plan, accountable owners.

## Context to inspect
Inspect policy intent, data classification, exposure, dependencies, previous exceptions, incidents, and available mitigations.

## Core knowledge
An exception does not erase risk. It must identify scope, rationale, residual risk, compensating controls, approver, expiry, and remediation. Permanent exceptions indicate policy or architecture debt requiring explicit treatment.

## Procedure
1. Confirm the requirement actually applies.
2. Define exact scope and requested duration.
3. Assess likelihood, impact, and affected obligations.
4. Identify feasible remediation and compensating controls.
5. Determine residual risk.
6. Route approval to an authority able to accept that risk.
7. Record decision, evidence, expiry, and owner.
8. Monitor compensating controls.
9. Notify before expiry and verify remediation.
10. Reassess rather than auto-renew.
11. Analyze exception trends for systemic problems.

## Decision points
Reject when residual risk exceeds authority/tolerance or violates non-waivable obligations. Prefer narrow, short-lived exceptions with measurable compensating controls.

## Common failure patterns
Auto-renewal, vague scope, approval by people without authority, no expiry, exceptions hidden in tickets, and compensating controls never verified.

## Verification
Sample exceptions and confirm applicability, approval authority, residual-risk rationale, active controls, expiry, and closure evidence.

## Expected output
Auditable exception record and remediation/monitoring plan.

## Stop conditions
Escalate non-waivable legal requirements, unacceptable residual risk, missing approval authority, or expired exceptions still in use.