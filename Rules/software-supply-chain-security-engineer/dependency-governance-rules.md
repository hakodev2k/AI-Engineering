# Dependency Governance Rules

## Purpose
Ensure third-party and internal dependencies are introduced, upgraded, and retired with controlled security risk.

## Scope
Application libraries, frameworks, system packages, build plugins, container layers, and transitive dependencies.

## MUST
- New dependencies MUST have a documented owner, purpose, source, versioning strategy, and security review appropriate to risk.
- Dependency versions MUST be reproducible through committed manifests and lockfiles where supported.
- Known critical vulnerabilities MUST have an explicit disposition before release.
- Transitive dependencies MUST be included in inventory and vulnerability analysis.
- Unsupported or abandoned dependencies MUST have a replacement or containment plan.

## MUST NOT
- MUST NOT add a dependency solely to avoid implementing trivial functionality without considering maintenance and attack-surface cost.
- MUST NOT consume packages from untrusted or ambiguous registries.
- MUST NOT silently ignore vulnerability findings based only on package popularity.

## SHOULD
- Dependencies SHOULD be minimized and reviewed for maintenance health, provenance, privilege, and update cadence.
- Automated dependency updates SHOULD be constrained by tests and policy gates.

## Exceptions
Exceptions require documented business need, risk acceptance, compensating controls, expiry, and accountable approval.

## Verification
Inspect manifests, lockfiles, SBOMs, vulnerability scans, registry sources, exception records, and dependency review evidence.