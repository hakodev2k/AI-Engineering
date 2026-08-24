# Dependencies and Compiler

## Purpose
Control supply-chain, compiler, and library risks that affect deployed bytecode.

## Scope
Compilers, frameworks, package dependencies, cryptographic libraries, and build tooling.

## MUST
- Pin or otherwise reproducibly constrain production compiler and dependency versions.
- Review security advisories and material changelogs before upgrades.
- Generate deployable artifacts from a reproducible, reviewable build.
- Validate compiler settings that affect semantics, optimization, metadata, or bytecode.
- Test behavior after dependency or compiler upgrades before deployment.

## MUST NOT
- Pull mutable or unreviewed dependencies into production builds.
- Upgrade a major framework/compiler solely to obtain convenience features without compatibility review.
- Ignore known exploitable dependency vulnerabilities without documented mitigation.

## SHOULD
- Minimize dependency count and privilege.
- Verify package provenance and lockfiles in CI.

## Exceptions
Emergency dependency changes require documented threat, compatibility evidence, focused testing, and approval.

## Verification
Inspect lockfiles, compiler settings, dependency scans, build provenance, reproducibility checks, and upgrade diffs.