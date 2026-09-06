# Artifact Signing Rules

## Purpose
Provide verifiable authenticity for model artifacts and prevent untrusted or substituted artifacts from entering governed deployment paths.

## Scope
Digital signatures, signing identities, verification policy, key rotation, and signed manifests.

## MUST
- Production-eligible model artifacts MUST have verifiable integrity evidence and SHOULD use cryptographic signatures where the deployment trust model requires authenticity.
- Signature metadata MUST bind the exact artifact digest and signing identity.
- Verification MUST occur before a signed artifact is accepted by a protected deployment path.
- Signing-key rotation MUST preserve the ability to verify artifacts that remain in service.

## MUST NOT
- MUST NOT treat a filename or registry path as proof of authenticity.
- MUST NOT accept invalid or unverifiable signatures in a protected promotion path.
- MUST NOT place private signing material in model packages or registry metadata.

## SHOULD
- Prefer hardware-backed or centrally managed signing identities for sensitive environments.
- Automate signature verification in release tooling.

## Exceptions
Exceptions require documented trust assumptions, compensating controls, risk review, and approval.

## Verification
Inspect signatures, certificate or key references, verification logs, rotation procedures, and negative verification tests.