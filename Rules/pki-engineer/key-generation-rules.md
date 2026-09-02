# Key Generation

## Purpose
Ensure private keys begin their lifecycle with adequate entropy, strength, provenance, and protection.

## Scope
Applies to CA, service, user, device, signing, and infrastructure key generation.

## MUST
- Keys MUST be generated with approved algorithms, sizes, curves, and randomness sources appropriate to their assurance level.
- High-value signing keys MUST be generated inside approved hardware-backed cryptographic modules when policy requires non-exportability.
- Key-generation events MUST record actor, method, algorithm, protection boundary, timestamp, and resulting public-key identifier.
- Generated private keys MUST receive access controls before becoming usable.

## MUST NOT
- MUST NOT generate production keys with test utilities, deterministic seeds, or unapproved randomness.
- MUST NOT copy private keys between systems when a fresh key can be securely generated at the destination.
- MUST NOT weaken key parameters to satisfy legacy integration without approved risk acceptance.

## SHOULD
- Prefer generation at the final protection boundary.
- Prefer modern algorithms with clear migration paths.

## Exceptions
Require compatibility evidence, bounded scope, compensating controls, expiry, and approval.

## Verification
Inspect cryptographic configuration, HSM logs, key metadata, generation procedures, and certificate public-key parameters.