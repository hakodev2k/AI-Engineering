# Cryptographic Incident and Compromise Rules

## Purpose
Contain cryptographic failures while preserving evidence and restoring trustworthy state.

## Scope
Key compromise, certificate misuse, nonce failures, algorithm breaks, implementation vulnerabilities, and trust-anchor incidents.

## MUST
- Treat suspected compromise according to impact until evidence bounds it.
- Identify affected keys, data, identities, systems, dependents, and validity windows.
- Preserve investigation evidence while preventing further unauthorized cryptographic use.
- Require human approval for emergency trust-anchor replacement, mass revocation, or destructive recovery actions.

## MUST NOT
- Delete evidence or rotate keys blindly before dependency and forensic needs are assessed.
- Declare containment based only on absence of alerts.

## SHOULD
- Maintain rehearsed compromise runbooks for high-impact key classes.

## Exceptions
Immediate containment may precede full analysis when delay increases harm; actions must be documented and reviewed.

## Verification
Incident timelines, audit logs, revocation/rotation records, dependency reconciliation, recovery tests, and post-incident review.