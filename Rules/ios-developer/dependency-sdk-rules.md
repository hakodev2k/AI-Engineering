# Dependency and SDK Rules

## Purpose
Control supply-chain, privacy, binary-size, compatibility, and operational risk from third-party code.

## Scope
Swift Package Manager dependencies, binary frameworks, SDKs, build plugins, and transitive dependencies.

## MUST
- New dependencies MUST have a documented need, ownership, license/security review proportional to risk, and maintenance assessment.
- Versions MUST be pinned or constrained according to the project's reproducibility policy.
- SDKs collecting data MUST be reviewed for privacy behavior and required disclosures.
- Major dependency upgrades MUST include compatibility, migration, rollback, and regression evidence.
- Unused dependencies MUST be removed.

## MUST NOT
- MUST NOT add a dependency for trivial functionality when its lifecycle or attack surface outweighs the benefit.
- MUST NOT execute untrusted build plugins or binaries without provenance review.
- MUST NOT silently accept dependency changes that alter permissions, data collection, or network destinations.

## SHOULD
- Prefer actively maintained, narrowly scoped dependencies with source visibility.
- Isolate vendor SDKs behind owned interfaces where replacement or testing matters.

## Exceptions
High-risk or closed-source dependencies require explicit technical/security approval and documented compensating controls.

## Verification
Review lockfiles and diffs, run dependency/security/license scans, inspect privacy manifests and binary contents where practical, and execute upgrade regression tests.