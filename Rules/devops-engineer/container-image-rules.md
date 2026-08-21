# Container Image Rules

## Purpose
Ensure container images are minimal, reproducible, secure, and operationally predictable.

## Scope
Applies to Dockerfiles, base images, build stages, registries, and runtime image configuration.

## MUST
- Base images MUST come from approved trusted registries and use supported versions.
- Images MUST run as non-root unless a documented technical requirement prevents it.
- Build stages MUST exclude secrets and unnecessary build-time artifacts from final images.
- Image digests or immutable tags MUST be used for production promotion where practical.
- Vulnerability scanning MUST run before production release and block unacceptable findings.

## MUST NOT
- MUST NOT bake credentials or environment-specific secrets into images.
- MUST NOT rely on `latest` for controlled production deployment.
- MUST NOT include compilers, shells, package caches, or debugging tools in runtime images without need.

## SHOULD
- Prefer multi-stage builds and minimal runtime bases.
- Prefer signed images and provenance metadata where supported.

## Exceptions
Any elevated runtime privilege or expanded image surface requires documented risk and approval.

## Verification
Inspect Dockerfiles, image layers, SBOMs, vulnerability scans, signatures, runtime user, and registry metadata.