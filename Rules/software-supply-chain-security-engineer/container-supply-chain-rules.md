# Container Supply Chain Rules

## Purpose
Protect container images from untrusted bases, mutable tags, embedded secrets, and provenance loss.

## Scope
Containerfiles, base images, registries, image build, signing, scanning, promotion, and deployment.

## MUST
- Production images MUST use approved base images from trusted registries.
- Base images and promoted images MUST be referenced by immutable digest where feasible.
- Images MUST be scanned for known vulnerabilities and embedded secrets before release.
- Final images MUST exclude unnecessary build tools, credentials, and temporary artifacts.
- Image provenance and signature policy MUST be verifiable before deployment.

## MUST NOT
- MUST NOT rely on mutable tags such as `latest` as the sole release identity.
- MUST NOT copy developer credentials or package-manager tokens into image layers.
- MUST NOT promote an image different from the one that passed release gates.

## SHOULD
- Images SHOULD minimize package count, privilege, and attack surface.
- Base-image refresh cadence SHOULD reflect vulnerability and support risk.

## Exceptions
Exceptions require risk evidence, owner, compensating controls, explicit approval, and expiry.

## Verification
Inspect image digests, Dockerfiles or Containerfiles, layer history, vulnerability and secret scans, signatures, provenance, and deployment manifests.