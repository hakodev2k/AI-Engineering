# Dependency and Supply Chain

## Purpose
Control security, compatibility, licensing, and maintenance risk introduced by crates and build dependencies.

## Scope
Cargo dependencies, features, registries, lockfiles, build scripts, proc macros, and vendored code.

## MUST
- New dependencies MUST have a clear need and maintenance/security assessment proportional to risk.
- Application lockfiles MUST be committed when reproducible dependency resolution is required.
- Security advisories affecting shipped code MUST be triaged with documented disposition.
- Dependency feature sets MUST be minimized to required capabilities.

## MUST NOT
- MUST NOT add abandoned or untrusted crates to sensitive paths without explicit risk acceptance.
- MUST NOT ignore vulnerable transitive dependencies solely because they are indirect.
- MUST NOT execute unreviewed build scripts or proc macros in privileged pipelines.

## SHOULD
- Prefer well-maintained crates with clear ownership, release history, and limited unsafe surface.
- Automate advisory, license, and dependency-drift checks.

## Exceptions
Risk acceptance requires impact, compensating controls, owner, and review date.

## Verification
Run `cargo audit` or equivalent, dependency/license scanners, feature-tree inspection, lockfile diff review, and CI reproducibility checks.