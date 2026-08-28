# Software Supply Chain Rules

## Purpose
Prevent compromised or irreproducible infrastructure software from entering AI environments.

## Scope
Applies to container images, packages, drivers, base images, binaries, manifests, and build pipelines.

## MUST
- Production artifacts MUST originate from controlled build pipelines with traceable source and dependencies.
- Images and packages MUST be vulnerability-scanned before promotion.
- Critical dependencies MUST be version-pinned or otherwise reproducibly resolved.
- Artifact provenance and integrity MUST be verifiable at deployment time where supported.

## MUST NOT
- MUST NOT deploy unverified binaries downloaded manually from unknown or mutable locations.
- MUST NOT disable vulnerability or signature checks merely to unblock a release.
- MUST NOT use floating dependency versions for critical infrastructure without documented controls.

## SHOULD
- Minimal base images SHOULD be preferred.
- Dependency updates SHOULD be staged and rollbackable.

## Exceptions
Exceptions require security review, provenance evidence, risk acceptance, expiry, and approval.

## Verification
Review SBOMs, scan results, build provenance, image digests, dependency locks, signatures, and deployment policy.