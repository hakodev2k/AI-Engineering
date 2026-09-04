# Container Image Supply Chain Rules

## Purpose
Protect containerized software from compromised base images, mutable tags, unverified registries, and unsafe image construction.

## Scope
Applies to container base images, build stages, registries, image metadata, signing, scanning, and deployment admission.

## MUST
- Production base images MUST come from approved sources and resolve to controlled versions or immutable digests.
- Images MUST be scanned for known vulnerabilities and prohibited content before promotion to trusted registries.
- Final images MUST exclude build credentials, package-manager tokens, and unnecessary build tooling.
- Image promotion MUST preserve digest identity and required provenance or signature evidence.
- Critical base-image updates MUST trigger rebuild and validation of dependent images according to defined risk policy.

## MUST NOT
- Production deployments MUST NOT rely on mutable latest tags as the sole artifact identity.
- Images from untrusted registries MUST NOT be promoted without provenance and security validation.
- Vulnerability scanners MUST NOT be treated as proof that an image is free of malicious content.

## SHOULD
- Minimal, maintained base images SHOULD be preferred where operational requirements permit.
- Deployment admission SHOULD verify registry, digest, signatures, and policy for high-assurance workloads.

## Exceptions
Exceptions require documented constraints, compensating controls, expiry, owner, and security approval.

## Verification
Inspect Dockerfiles or build definitions, image layers, registry origin, digests, scan results, signatures, SBOMs, and deployment admission policy.