# Artifact Signing and Verification

## Purpose
Establish cryptographic evidence that released artifacts originate from authorized processes and have not been substituted after approval.

## When to use
Use for release pipelines, container images, packages, binaries, firmware, or any artifact crossing a trust boundary.

## Inputs
Artifact formats, registry capabilities, signing technology, identity provider, release policy, and verification environments.

## Context to inspect
Trace artifact creation, signing identity, key or certificate lifecycle, registry mutability, promotion, deployment verification, and break-glass paths.

## Core knowledge
Signing is useful only when verifiers enforce trusted identities and artifact digests. Keyless signing can bind ephemeral certificates to workload identity; key-based systems require rigorous key custody and rotation.

## Procedure
1. Define which artifact digest is the security identity.
2. Define authorized signing identities and issuance conditions.
3. Sign only after required build and policy checks.
4. Store signatures and attestations where they remain bound to the digest.
5. Enforce verification at promotion or deployment boundaries.
6. Validate identity, issuer, signature, digest, and policy constraints.
7. Protect or eliminate long-lived private keys.
8. Define rotation, revocation, and compromise response.
9. Log verification failures and bypasses.
10. Test tampered, unsigned, expired, and unauthorized artifacts.

## Decision points
Use keyless identity where infrastructure supports trustworthy issuance and transparency; use managed keys when offline or ecosystem constraints require them. Verification enforcement matters more than signature generation alone.

## Common failure patterns
Signing mutable tags; verifying cryptography but not signer identity; storing keys in CI variables; allowing silent verification bypass; signing before final packaging.

## Verification
Attempt deployment of valid, modified, unsigned, and wrongly signed artifacts. Confirm only policy-compliant digests pass and failures are observable.

## Expected output
An enforceable signing and verification chain with documented trust roots and recovery procedures.

## Stop conditions
Escalate if signing credentials may be compromised, trust roots cannot be established, or production permits unverifiable artifacts without approved exception.