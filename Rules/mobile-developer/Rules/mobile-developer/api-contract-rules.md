# API Contract Rules
## Purpose
Keep mobile clients compatible with independently deployed services.
## Scope
Remote schemas, versioning, serialization, pagination, errors, and feature compatibility.
## MUST
- Clients MUST tolerate documented additive server changes and unknown optional fields.
- Required remote fields and enum evolution MUST have explicit compatibility behavior.
- Breaking server changes MUST have a migration window compatible with supported app versions.
## MUST NOT
- A server deployment MUST NOT assume all users immediately upgrade the mobile app.
- Unknown enum values MUST NOT crash critical flows when forward compatibility is required.
## SHOULD
- Capability negotiation or feature flags SHOULD be used when client/server rollout order matters.
## Exceptions
Coordinated closed deployments may use stricter coupling when version enforcement is guaranteed.
## Verification
Run contract tests against supported API versions and fixtures containing missing, additional, and unknown values.