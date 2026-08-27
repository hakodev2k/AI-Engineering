# Drift and Reconciliation Rules

## Purpose
Detect and correct divergence without erasing legitimate emergency or externally owned state.

## Scope
Desired-versus-observed comparison, drift classification, remediation, exemptions, and ownership.

## MUST
- Drift detection MUST compare only attributes owned by the automation domain or explicitly classify external ownership.
- Material drift MUST identify target, attribute, expected value, observed value, and likely ownership/source.
- Automatic remediation MUST be limited to approved drift classes with known safe convergence behavior.
- Emergency manual changes MUST be reconcilable back into intent or explicitly reverted after review.
- Reconciliation MUST revalidate current state immediately before mutation.

## MUST NOT
- MUST NOT overwrite unknown manual state merely because it differs from generated configuration.
- MUST NOT remediate security, routing, or management-path drift automatically when ownership or blast radius is ambiguous.
- MUST NOT suppress persistent drift without a documented exemption and owner.

## SHOULD
- Drift severity SHOULD reflect service, security, and future-change risk rather than textual diff size.
- Exemptions SHOULD expire and be periodically reviewed.

## Exceptions
Approved unmanaged attributes require explicit ownership boundary, rationale, and verification that automation will preserve them.

## Verification
Inject representative drift, confirm classification and ownership, test safe versus approval-required remediation, inspect exemption expiry, and verify emergency-change reconciliation.