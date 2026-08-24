# Secure Toolchain Management

## Purpose
Control compilers, SDKs, build tools, package managers, linters, generators, and other executable tooling that can influence released artifacts.

## When to use
Use when standardizing development/build environments, upgrading toolchains, or investigating unexplained artifact changes.

## Inputs
Toolchain manifests, installation sources, versions, checksums/signatures, build images, update policy, and compatibility requirements.

## Context to inspect
Identify where tools are downloaded, who publishes them, whether versions are pinned, how integrity is checked, and whether developer and CI toolchains differ.

## Core knowledge
Toolchains are executable dependencies with privileged influence over outputs. Trusted distribution, immutable versioning, controlled updates, and reproducible environment definitions reduce compromise risk.

## Procedure
1. Inventory tools that execute during build and release.
2. Classify them by influence over final artifacts.
3. Define approved publishers and distribution channels.
4. Pin versions and verify hashes/signatures where available.
5. Build standardized toolchain images or environment definitions.
6. Remove ad hoc network installers from sensitive builds.
7. Test upgrades in isolated representative pipelines.
8. Record toolchain identity in provenance.
9. Monitor upstream advisories and ownership changes.
10. Retain rollback capability for critical toolchain releases.

## Decision points
Centralized toolchain images improve consistency but become high-value artifacts requiring their own secure build process. Rapid auto-updates are appropriate only for low-risk tools with strong tests.

## Common failure patterns
Curl-pipe-shell installers in releases; floating SDK versions; unsigned mirrors; developer-only tools omitted from threat models; untracked compiler changes.

## Verification
Recreate builds from approved environment definitions, confirm tool versions and origins, and compare provenance to policy.

## Expected output
A governed, traceable toolchain with controlled sources and upgrade workflow.

## Stop conditions
Escalate on suspected toolchain compromise, unverifiable binaries, unexplained compiler drift, or mandatory upstream updates that break critical builds.