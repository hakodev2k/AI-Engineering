# List Quality Rules

## Purpose
Prevent invalid, stale, risky, or unconsented addresses from degrading delivery and trust.

## Scope
Recipient acquisition, validation, imports, inactivity, suppression, and audience hygiene.

## MUST
- Every address source MUST be attributable to a documented acquisition path and applicable permission basis.
- Hard bounces, repeated invalid recipients, complaints, and permanent suppressions MUST be excluded from future applicable sends.
- Bulk imports MUST be risk-assessed before activation and monitored separately during initial sends.
- Address normalization and validation MUST preserve the original evidence needed for audit and troubleshooting.
- Dormant audiences MUST be treated as higher risk and reactivation MUST use controlled volume and monitoring.

## MUST NOT
- MUST NOT send to purchased, scraped, guessed, or harvested addresses.
- MUST NOT remove suppressions merely to increase reachable audience.
- MUST NOT treat syntax validation as evidence of consent or mailbox ownership.

## SHOULD
- Use confirmed ownership or equivalent stronger verification where abuse risk warrants it.
- Track list-quality metrics by acquisition source.

## Exceptions
Any exceptional re-contact requires documented legal/operational basis, scope, risk review, expiry, and approval.

## Verification
Sample acquisition records, suppression state, bounce history, import provenance, cohort metrics, and recipient lifecycle logic. Test that suppressed recipients cannot enter normal send paths.