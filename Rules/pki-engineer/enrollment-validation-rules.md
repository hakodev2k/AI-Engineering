# Enrollment Validation

## Purpose
Ensure certificate requests are bound to verified identities, systems, and authorization.

## Scope
Applies to CSR intake, domain or device validation, requester identity, ownership checks, and enrollment workflows.

## MUST
- Every certificate request MUST be authenticated and authorized before issuance.
- Requested names and identities MUST be validated against authoritative sources or approved control-plane evidence.
- Automated enrollment MUST preserve an auditable link between requester, workload identity, requested names, and issued certificate.
- Validation evidence MUST remain available for the required audit period.

## MUST NOT
- MUST NOT rely solely on self-asserted CSR subject fields.
- MUST NOT approve ownership based only on unauthenticated email, chat, or manual statements.
- MUST NOT reuse stale validation evidence beyond policy-defined validity.

## SHOULD
- Prefer machine-verifiable ownership and identity checks.
- Use stronger validation for higher-impact certificate classes.

## Exceptions
Require documented reason, alternative evidence, bounded scope, risk acceptance, and approval.

## Verification
Review enrollment logs, identity-provider records, ownership sources, CSR validation output, authorization checks, and sampled issuance evidence.