# Package and Artifact Signing Rules

## Purpose
Establish cryptographic integrity and publisher authenticity for software artifacts crossing trust boundaries.

## Scope
Applies to packages, binaries, container images, installers, manifests, attestations, and release metadata where signing is supported or required.

## MUST
- Signing keys or workload identities MUST be protected with least privilege and separated from ordinary developer credentials.
- Release artifacts designated as signed MUST be verified before promotion, installation, or deployment.
- Verification policy MUST bind signatures to approved identities and artifact digests.
- Key or identity rotation MUST preserve a documented trust transition and revocation path.
- Signing operations MUST produce auditable evidence linking artifact, signer, and release context.

## MUST NOT
- Private signing material MUST NOT be stored in source control, build logs, or general-purpose plaintext configuration.
- Signature presence alone MUST NOT establish trust unless signer identity and policy are validated.
- Verification failures MUST NOT be bypassed silently.

## SHOULD
- Prefer short-lived workload identity or hardware-backed key protection for high-value release pipelines.
- Signing SHOULD occur after final artifact construction to avoid invalidating integrity guarantees.

## Exceptions
Exceptions require security approval, defined scope, compensating integrity checks, expiry, and remediation plan.

## Verification
Inspect signing configuration, identity permissions, signature verification logs, trust roots, revocation procedures, artifact digests, and CI release gates.