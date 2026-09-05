# Dependency and Supply Chain Rules

## Purpose
Reduce deployment and security risk from edge inference runtimes, native libraries, model conversion tools, and third-party packages.

## Scope
Runtime dependencies, native binaries, SDKs, conversion toolchains, package registries, and build inputs.

## MUST
- Production dependencies MUST be version-pinned or constrained reproducibly.
- Known vulnerability and license checks MUST run before release according to project policy.
- Native and runtime dependency upgrades MUST be tested on representative supported devices.
- Build inputs MUST come from trusted sources and preserve provenance.

## MUST NOT
- MUST NOT introduce unreviewed binary dependencies into production builds.
- MUST NOT disable dependency verification merely to unblock a release.

## SHOULD
- Minimize native dependency surface and remove unused packages.

## Exceptions
Require business need, risk assessment, compensating controls, owner, and approval.

## Verification
Inspect lockfiles, dependency manifests, scanner results, provenance records, and device regression tests.