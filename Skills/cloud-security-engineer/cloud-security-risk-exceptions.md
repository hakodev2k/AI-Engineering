# Cloud Security Risk Exceptions

## Purpose
Handle necessary deviations from cloud security standards without turning temporary exceptions into unmanaged permanent risk.

## When to use
Use when a required control cannot be implemented immediately because of technical, business, migration, or vendor constraints.

## Inputs
Requested exception, affected assets, control requirement, business justification, threat context, duration, and proposed compensating controls.

## Context to inspect
Inspect actual exposure, asset criticality, existing controls, incident history, remediation feasibility, ownership, and approval authority.

## Core knowledge
An exception is a risk decision, not a policy bypass. It requires bounded scope, explicit owner, compensating controls, expiry, and remediation plan.

## Procedure
1. State the exact control deviation.
2. Validate business necessity.
3. Identify assets and attack paths affected.
4. Estimate likelihood and impact.
5. Define compensating preventive/detective controls.
6. Minimize scope and duration.
7. Assign remediation owner and deadline.
8. Obtain approval from authorized risk owner.
9. Monitor compensating controls.
10. Reassess at expiry; close or reapprove with new evidence.

## Decision points
Reject exceptions where residual risk exceeds tolerance or compensating controls are not credible. Prefer temporary architectural constraints over broad policy disablement.

## Common failure patterns
No expiry, vague scope, self-approval, compensating controls never verified, and repeated renewals without remediation.

## Verification
Confirm exception scope matches deployed state, compensating controls operate, and expiry/remediation tracking is active.

## Expected output
Auditable risk exception with rationale, owner, controls, approval, expiry, and closure criteria.

## Stop conditions
Escalate when approval authority is unclear, mandatory obligations prohibit exception, or risk cannot be reduced to an acceptable level.