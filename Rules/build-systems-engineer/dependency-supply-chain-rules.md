# Dependency Supply Chain Rules

## Purpose
Control third-party build dependencies so external code and tools do not silently compromise correctness, reproducibility, or security.

## Scope
Applies to build plugins, package managers, compiler plugins, generators, external archives, vendored tools, and transitive build dependencies.

## MUST
- External dependencies MUST be version-pinned or otherwise resolved to immutable identities.
- Dependency updates MUST be reviewable and MUST preserve an auditable record of version changes.
- Integrity metadata MUST be verified when the ecosystem provides it.
- Build-critical dependencies MUST have ownership and an upgrade policy.
- High-impact dependency changes MUST be validated in representative builds before broad adoption.

## MUST NOT
- MUST NOT execute unreviewed build scripts fetched from mutable locations in trusted pipelines.
- MUST NOT disable integrity verification merely to bypass a resolution failure.
- MUST NOT accept unexpected transitive dependency expansion without review.

## SHOULD
- Dependencies SHOULD be minimized and sourced from approved registries or mirrors.
- Automated dependency scanning SHOULD be integrated into CI where practical.

## Exceptions
An exceptional source or temporary integrity workaround MUST document reason, scope, expiry, compensating controls, and approval.

## Verification
Inspect lockfiles, checksums, dependency graphs, source registries, update diffs, scanner output, and build logs for unexpected resolution behavior.