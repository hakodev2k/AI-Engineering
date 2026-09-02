# Issuance Approval

## Purpose
Prevent unauthorized or high-risk certificates from entering trusted environments.

## Scope
Applies to manual and automated certificate issuance approvals, policy gates, and exceptional requests.

## MUST
- Issuance MUST pass policy, identity, profile, and authorization checks before signing.
- High-impact certificate classes MUST require approval commensurate with their risk and blast radius.
- Approval evidence MUST identify the request, approver or automated policy decision, timestamp, and applicable policy.
- Automated approval logic MUST be version-controlled and testable.

## MUST NOT
- MUST NOT sign certificates to resolve an operational outage when required validation is missing.
- MUST NOT allow a single requester to bypass independent approval where separation of duties is required.
- MUST NOT silently weaken approval thresholds for bulk issuance.

## SHOULD
- Prefer deterministic policy-as-code for routine issuance.
- Escalate unusual SAN scope, validity, or key usage for human review.

## Exceptions
Require explicit scope, risk, compensating controls, expiration, and accountable approval.

## Verification
Inspect issuance workflows, policy engine results, audit logs, approval records, negative tests, and sample certificates.