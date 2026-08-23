# Device Identity and Provisioning

## Purpose
Establish unique, verifiable device identities and secure enrollment from manufacturing through retirement.

## When to use
Use when onboarding devices, rotating credentials, transferring ownership, or redesigning fleet trust.

## Inputs
Manufacturing flow, identity provider, cryptographic hardware, ownership model, fleet lifecycle.

## Context to inspect
Factory provisioning, bootstrap credentials, certificate stores, TPM/secure elements, backend registries, and revocation processes.

## Core knowledge
Device identity must resist cloning and unauthorized enrollment. Bootstrap trust should be narrower and shorter-lived than operational identity.

## Procedure
1. Define identity scope and ownership lifecycle.
2. Select unique key/certificate generation strategy.
3. Protect private material in hardware where justified.
4. Design bootstrap authentication and enrollment.
5. Bind identity to authorized tenant/site/device metadata.
6. Define credential rotation, revocation, replacement, and factory-reset behavior.
7. Audit provisioning events.
8. Test stolen, duplicated, expired, and revoked credentials.

## Decision points
Factory-installed identities improve initial trust; just-in-time enrollment improves flexibility. Hardware-backed keys are preferred when physical compromise risk warrants cost.

## Common failure patterns
Shared fleet secrets, permanent bootstrap tokens, keys in logs, insecure factory reset, and no revocation path.

## Verification
Confirm unauthorized devices cannot enroll, secrets are non-exportable where required, rotation works, and revoked devices lose access.

## Expected output
A documented provisioning and identity lifecycle with tested trust boundaries.

## Stop conditions
Stop when manufacturing custody, root trust, or ownership authority cannot be established.