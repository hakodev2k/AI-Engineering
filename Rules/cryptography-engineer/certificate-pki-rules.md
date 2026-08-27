# Certificate and PKI Rules

## Purpose
Ensure certificate-based trust is explicit, constrained, and operable.

## Scope
X.509 certificates, trust stores, issuance, validation, revocation, and trust anchors.

## MUST
- Validate certificate chain, identity, validity period, intended usage, algorithm policy, and applicable revocation requirements.
- Protect CA and trust-anchor keys according to their blast radius.
- Inventory certificate ownership, dependencies, expiry, and renewal mechanisms.

## MUST NOT
- Disable certificate validation or hostname/identity checks to resolve connectivity failures.
- Add broad trust anchors without documented trust implications and approval.
- Depend on manual renewal for critical production certificates without explicit operational controls.

## SHOULD
- Automate issuance, renewal, and expiry monitoring.

## Exceptions
Private or constrained PKI deviations require documented trust model, scope, controls, and approval.

## Verification
Inspect trust stores, issuance policy, validation code, expiry monitoring, revocation behavior, and renewal drills.