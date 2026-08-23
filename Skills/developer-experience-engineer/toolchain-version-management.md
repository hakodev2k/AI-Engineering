# Toolchain Version Management

## Purpose
Keep developer toolchains reproducible, supportable, and upgradeable across repositories and environments.

## When to use
Use when runtime/package/tool versions drift, upgrades break teams unpredictably, or local and CI environments disagree.

## Inputs
Tool inventory, support policies, manifests, CI images, security advisories, and compatibility constraints.

## Context to inspect
Inspect version pins, transitive dependencies, global tools, base images, package registries, lockfiles, and upgrade automation.

## Core knowledge
Pin where reproducibility matters, define supported ranges deliberately, and automate upgrades with validation. Version policy must include lifecycle and rollback.

## Procedure
1. Inventory critical toolchain components.
2. Identify implicit/unmanaged versions.
3. Define supported versions and ownership.
4. Encode versions in machine-readable manifests.
5. Align local and CI resolution.
6. Automate update proposals.
7. Validate compatibility through representative tests.
8. Roll out progressively with rollback guidance.
9. Remove unsupported versions deliberately.

## Decision points
Pin exact versions for build-critical tooling; allow ranges only where compatibility is tested and useful.

## Common failure patterns
Latest-by-default builds, stale base images, hidden global dependencies, synchronized mass upgrades without testing, and no rollback path.

## Verification
Rebuild from clean environments, compare resolved versions, execute compatibility tests, and simulate an upgrade and rollback.

## Expected output
An explicit version policy with manifests, automated updates, validation, and deprecation process.

## Stop conditions
Stop when upstream compatibility is unknown, required versions have unresolved vulnerabilities, or rollback cannot be performed safely.