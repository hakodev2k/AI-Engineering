# Dependency Rules

## Purpose
Control package, library, and framework risk throughout the dependency lifecycle.

## Scope
Applies to NuGet packages, shared libraries, SDKs, generated clients, and transitive dependencies.

## MUST
- New dependencies MUST have a clear capability need and ownership rationale.
- License, maintenance status, security posture, target-framework compatibility, and transitive impact MUST be reviewed before adoption when material.
- Major upgrades MUST identify breaking changes, migration impact, rollback path, and verification scope.
- Security-sensitive dependencies MUST be updated or risk-accepted based on credible vulnerability evidence.
- Lockfiles or deterministic restore mechanisms MUST be used where supported by the project policy.

## MUST NOT
- MUST NOT add a large dependency for trivial functionality without justified value.
- MUST NOT suppress vulnerability findings without documented assessment.
- MUST NOT perform broad dependency migrations without compatibility tests.

## SHOULD
- Prefer stable, well-maintained dependencies with minimal required surface area.
- Remove unused dependencies promptly.

## Exceptions
Exceptions require documented alternatives considered, maintenance/security risk, and reviewer approval.

## Verification
Use restore/build tests, dependency scanners, license inspection, release-note review, compatibility tests, and package graph inspection.