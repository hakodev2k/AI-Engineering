# Digital Signatures and Verification

## Purpose
Design and review digital-signature workflows that provide authentic, context-bound, verifiable statements.

## When to use
Use for software/artifact signing, signed documents, protocol messages, attestations, certificates, or long-lived verification evidence.

## Inputs
Signer identity, message semantics, verification audience, algorithm policy, key custody, encoding, timestamping, and retention requirements.

## Context to inspect
Canonicalization, signed fields, key/certificate discovery, trust roots, revocation, signature encoding, replay context, and verification errors.

## Core knowledge
A valid signature proves possession of a signing key over exact bytes; it does not by itself establish authorization, intent, freshness, or semantic identity. Context and canonical representation must be defined.

## Procedure
1. Define precisely what statement is being signed.
2. Specify canonical bytes or a standardized signed format.
3. Add domain separation and context where needed.
4. Select approved signature scheme and parameters.
5. Protect signing keys according to impact.
6. Bind signer identity and key metadata.
7. Define verifier trust, time, revocation, and policy checks.
8. Reject malformed/non-canonical encodings.
9. Add replay/freshness controls outside the signature when required.
10. Test positive, negative, historical, and rotated-key cases.

## Decision points
Use MACs when all parties share trust and public verifiability is unnecessary; use signatures when asymmetric verification or accountability is required. Hardware-backed signing is appropriate for high-impact keys.

## Common failure patterns
Signing ambiguous serialization; verifying signature but not authorization; accepting any trusted certificate purpose; replayable signed commands; weak key custody; ignoring revocation/time.

## Verification
Test altered bytes, alternate encodings, wrong identities, expired/revoked keys, key rotation, and cross-domain substitution.

## Expected output
A signature profile defining bytes, context, algorithms, trust policy, custody, verification, and lifecycle.

## Stop conditions
Stop if message semantics cannot be made unambiguous or signer authorization/trust policy is undefined.