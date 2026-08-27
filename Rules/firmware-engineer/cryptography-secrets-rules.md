# Cryptography and Secrets

## Purpose
Protect keys, credentials, and cryptographic operations on constrained devices.

## Scope
Device identity, keys, random numbers, encryption, signatures, and provisioning.

## MUST
- Approved cryptographic primitives and libraries MUST be used for security boundaries.
- Secret material MUST have defined generation, storage, access, rotation/revocation, and destruction behavior.
- Cryptographic random values MUST come from a suitable entropy source and DRBG design.
- Device-unique credentials MUST be used where shared fleet credentials would create unacceptable blast radius.
- Sensitive comparisons and key operations MUST consider side-channel exposure where threat-relevant.

## MUST NOT
- Secrets MUST NOT be hard-coded in source, firmware images, logs, or test fixtures intended for production.
- Custom cryptographic algorithms MUST NOT protect production security boundaries.

## SHOULD
- Hardware-backed key storage SHOULD be used when available and justified.

## Exceptions
Exceptions require security review and threat-model evidence.

## Verification
Use secret scanning, binary inspection, provisioning tests, crypto configuration review, and penetration testing.