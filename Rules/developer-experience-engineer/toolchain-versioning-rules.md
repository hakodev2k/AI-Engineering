# Toolchain Versioning Rules
## Purpose
Keep developer toolchains reproducible, supportable, and safely evolvable.
## Scope
Compilers, runtimes, package managers, linters, formatters, generators, and CLIs.
## MUST
- Required tool versions MUST be declared in machine-readable configuration where supported.
- Upgrades MUST assess compatibility, migration cost, security impact, and rollback.
- Toolchain changes affecting generated or shipped output MUST be validated in CI.
- Unsupported versions MUST have an explicit deprecation path.
## MUST NOT
- MUST NOT rely on an unspecified latest version for critical tooling.
- MUST NOT introduce breaking upgrades without migration evidence and owner review.
- MUST NOT downgrade security controls solely for compatibility convenience.
## SHOULD
- Version management SHOULD be automated and consistent across local and CI environments.
- Upgrade cadence SHOULD balance security, ecosystem support, and migration cost.
## Exceptions
Emergency pins require reason, risk, owner, expiry/review date, and verification.
## Verification
Inspect version manifests, lockfiles, CI images, compatibility tests, dependency advisories, and rollback procedures.