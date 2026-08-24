# Dependency and Build Rules

## Purpose
Control supply-chain, compatibility, build reproducibility, and dependency-cost risks.

## Scope
Applies to Gradle configuration, plugins, libraries, repositories, version catalogs, and build variants.

## MUST
- Evaluate new dependencies for maintenance, license, security, binary/runtime cost, transitive graph, and necessity.
- Pin or constrain dependency/plugin versions according to the project's reproducibility policy.
- Keep release and debug-only tooling separated so diagnostics do not unintentionally ship.
- Review major dependency or build-system migrations with rollback and compatibility evidence.
- Keep signing credentials and repository secrets outside source control.

## MUST NOT
- Add a dependency for trivial functionality without considering lifecycle and supply-chain cost.
- Resolve production builds from untrusted or ad-hoc repositories without approval.
- Disable dependency/security checks merely to make CI pass.

## SHOULD
- Centralize version governance and automate safe update visibility.
- Remove unused dependencies and plugins.

## Exceptions
Temporary pins or vulnerable-version exceptions require documented impact, mitigation, owner, and expiry.

## Verification
Inspect dependency graphs, lock/version configuration, SBOM/scanner output where available, APK/AAB contents, build variants, and CI reproducibility.