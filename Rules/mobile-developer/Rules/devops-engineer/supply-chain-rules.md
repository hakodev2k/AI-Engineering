# Supply Chain Rules

## Purpose
Protect software delivery from compromised dependencies, build inputs, registries, and artifacts.

## Scope
Applies to package managers, container registries, CI actions, build plugins, artifacts, and provenance.

## MUST
- Third-party build dependencies MUST be version-controlled, reviewed, and sourced from trusted locations.
- Production artifacts MUST be traceable to source revision, build process, and dependency set.
- Dependency and image vulnerability scanning MUST run according to risk policy.
- CI extensions and reusable actions MUST be pinned to reviewed versions or immutable references when supported.
- Artifact repositories MUST enforce access control and retention appropriate to release criticality.

## MUST NOT
- MUST NOT execute unreviewed remote scripts in privileged production build paths.
- MUST NOT promote artifacts whose origin or integrity cannot be established.
- MUST NOT ignore critical supply-chain findings without documented approval.

## SHOULD
- Prefer SBOM generation, artifact signing, provenance metadata, and dependency allowlists for sensitive systems.

## Exceptions
A temporary dependency exception requires owner, risk assessment, expiry, and monitoring.

## Verification
Inspect lock files, registry settings, SBOMs, signatures, provenance records, scanner results, and CI dependency definitions.