# Software Supply Chain Rules

## Purpose
Reduce compromise risk across source, build, dependency, artifact, and release paths.

## Scope
Source control, CI/CD, dependencies, package registries, build systems, artifacts, signing, and release promotion.

## MUST
- Build and release paths MUST define trusted identities, protected branches, artifact provenance, and approval boundaries.
- Dependencies MUST be sourced from approved locations and continuously assessed for known vulnerabilities and ownership risk.
- Release artifacts MUST be immutable after verification and promoted without rebuilding where practical.
- High-impact build credentials MUST be short-lived or tightly scoped and protected from untrusted jobs.
- Critical artifacts SHOULD have verifiable provenance or signing appropriate to ecosystem capability.

## MUST NOT
- MUST NOT execute untrusted dependency or pull-request code with production release credentials.
- MUST NOT bypass required security checks by changing pipeline policy without approval.
- MUST NOT deploy artifacts whose origin or integrity cannot be established for high-risk systems.

## SHOULD
- Prefer hermetic or reproducible builds, pinned dependencies, isolated builders, and automated policy checks.

## Exceptions
Require rationale, affected release scope, compensating controls, verification, expiry, and approval.

## Verification
Inspect branch protection, workflow permissions, dependency manifests, scanner results, artifact metadata, signatures/provenance, and release logs.