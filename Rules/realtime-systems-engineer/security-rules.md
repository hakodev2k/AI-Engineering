# Real-Time Security Rules

## Purpose
Protect confidentiality, integrity, availability, and safety without introducing uncontrolled timing behavior.

## Scope
Authentication, authorization, cryptography, secure boot, secrets, interfaces, updates, and denial-of-service resistance.

## MUST
- Security controls on deadline-sensitive paths MUST have characterized timing and resource costs.
- Privileged operations MUST use least privilege and explicit authorization boundaries.
- Secrets and credentials MUST be stored and transmitted using approved protected mechanisms.
- Externally reachable inputs MUST be bounded, validated, and resistant to resource-exhaustion attacks.
- Security failure modes MUST define whether traffic is rejected, degraded, isolated, or placed in a safe state.

## MUST NOT
- MUST NOT disable authentication, validation, cryptographic verification, or isolation merely to meet a timing target.
- MUST NOT log credentials, keys, or authentication tokens.

## SHOULD
- Prefer security mechanisms with predictable execution and bounded memory use for hard real-time paths.

## Exceptions
Weakening a security control requires explicit human approval, documented threat analysis, compensating controls, and expiry or remediation plan.

## Verification
Use threat modeling, configuration inspection, static analysis, dependency scanning, penetration testing, timing measurements, and overload testing.