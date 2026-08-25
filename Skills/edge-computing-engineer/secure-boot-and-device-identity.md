# Secure Boot and Device Identity

## Purpose
Establish trustworthy device startup and cryptographic identity so edge nodes can prove what they are and what software they run.

## When to use
Use when devices authenticate to management systems, receive sensitive workloads, or operate in physically exposed locations.

## Inputs
Hardware trust features, bootloader capabilities, key storage, certificate authority model, manufacturing process.

## Context to inspect
Inspect ROM/bootloader trust anchors, firmware signing, TPM/secure element support, certificate enrollment, key rotation, and recovery paths.

## Core knowledge
A trustworthy chain begins at an immutable or hardware-protected root, verifies each boot stage, protects private keys, and supports revocation and rotation without bricking the fleet.

## Procedure
1. Identify available hardware root-of-trust capabilities.
2. Define the verified-boot chain and signing authorities.
3. Generate or inject unique device identity securely.
4. Protect private keys from application access where possible.
5. Define enrollment and attestation flows.
6. Define certificate and signing-key rotation.
7. Design recovery for expired or revoked credentials.
8. Separate manufacturing trust from production access.
9. Record identity lifecycle events.
10. Test tampered images and revoked identities.

## Decision points
Prefer hardware-backed keys where available. Use attestation when the relying system needs evidence of platform state, not merely possession of a credential.

## Common failure patterns
Cloned credentials, unsigned boot stages, unrecoverable key expiry, production keys exposed in manufacturing, disabled verification for support convenience.

## Verification
Demonstrate rejection of modified software, successful key rotation, revocation, and recovery on representative hardware.

## Expected output
A verified boot and identity lifecycle design with provisioning, rotation, revocation, and recovery.

## Stop conditions
Stop if the platform cannot provide an acceptable trust anchor for the stated threat model.