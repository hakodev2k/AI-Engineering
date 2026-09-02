# Certificate Profiles

## Purpose
Make issued certificates interoperable, constrained, and policy-compliant.

## Scope
Applies to subject naming, SANs, key usage, EKU, basic constraints, policy OIDs, validity, and extensions.

## MUST
- Certificate profiles MUST define required and prohibited extensions for each certificate class.
- Subject Alternative Name content MUST be validated against authoritative identity or ownership evidence.
- Key Usage and Extended Key Usage MUST reflect only intended cryptographic purposes.
- CA certificates MUST assert appropriate Basic Constraints and path controls.
- Profile changes MUST be compatibility-tested against representative relying parties.

## MUST NOT
- MUST NOT issue unconstrained wildcard or multi-purpose certificates without explicit policy justification.
- MUST NOT copy arbitrary CSR extensions into issued certificates without validation.
- MUST NOT omit required critical extensions because a client handles them poorly without approved exception.

## SHOULD
- Keep profiles narrow and purpose-specific.
- Prefer machine-readable profile validation in issuance pipelines.

## Exceptions
Require documented interoperability evidence, risk, scope, expiry, and security approval.

## Verification
Validate sample certificates with linting tools, chain validators, relying-party tests, and policy/profile comparison.