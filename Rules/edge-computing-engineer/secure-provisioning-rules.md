# Secure Provisioning
## Purpose
Ensure new and replacement edge nodes enter service in a known, authorized state.
## Scope
Manufacturing handoff, bootstrap, enrollment, and initial configuration.
## MUST
- Provisioning MUST authenticate both the node and provisioning authority.
- Bootstrap secrets MUST be single-use, short-lived, or otherwise tightly constrained.
- Initial configuration MUST be integrity-protected and traceable to an approved source.
## MUST NOT
- MUST NOT ship universal production passwords, keys, or tokens.
- MUST NOT expose provisioning interfaces indefinitely after enrollment.
## SHOULD
- Provisioning SHOULD be reproducible and automated with auditable artifacts.
## Exceptions
Manual provisioning requires dual verification for sensitive environments and documented evidence.
## Verification
Review images, bootstrap flows, secret lifecycle, enrollment logs, and factory-reset/re-enrollment tests.