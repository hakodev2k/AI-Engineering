# Dependency Governance Rules

## Purpose
Control external and internal dependencies so they do not erode architecture, security, or maintainability.

## Scope
Applies to frameworks, libraries, SDKs, shared packages, runtime dependencies, and major upgrades.

## MUST
- New dependencies MUST have a clear architectural purpose, ownership, maintenance status, security posture, and exit consideration.
- Major dependency upgrades MUST assess compatibility, operational risk, and migration effort.
- Shared dependencies that affect many modules MUST have controlled versioning and rollout strategy.
- Critical dependencies MUST be monitored for vulnerabilities and end-of-life status.

## MUST NOT
- MUST NOT add a dependency for trivial functionality when lifecycle cost exceeds value.
- MUST NOT allow transitive dependencies to silently determine architectural boundaries.
- MUST NOT perform large dependency migrations without review, evidence, and rollback or containment planning.

## SHOULD
- Prefer stable, well-supported dependencies with bounded scope.
- Prefer adapters around volatile external APIs where replacement cost would otherwise spread broadly.

## Exceptions
Specialized dependencies may be accepted when benefits and risks are documented and approved by relevant owners.

## Verification
Use dependency inventories, lockfiles, security scanners, license checks, upgrade tests, and architecture review.