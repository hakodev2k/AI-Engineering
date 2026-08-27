# Toolchain Versioning and Provisioning

## Purpose
Control compilers, SDKs, linkers, package managers, generators, and plugins as explicit versioned build inputs.

## When to use
Use for upgrades, developer/CI drift, multi-platform builds, or reproducibility work.

## Inputs
Supported platforms, tool versions, compatibility matrices, lock/config files, release notes, and artifact requirements.

## Context to inspect
Inspect PATH discovery, global installations, wrapper scripts, container images, plugin versions, compiler/linker flags, and transitive tool downloads.

## Core knowledge
Toolchains affect both output semantics and cache keys. Version pinning must include plugins and auxiliary generators, not only the primary compiler. Upgrade blast radius includes ABI, diagnostics, optimization, and artifact format changes.

## Procedure
1. Inventory every executable involved in builds.
2. Identify ambient/global discovery.
3. Define canonical versions and checksums.
4. Provision tools through reproducible bootstrap mechanisms.
5. Record platform-specific constraints.
6. Make toolchain identity part of action/cache keys.
7. Test upgrades on representative targets before defaulting.
8. Compare diagnostics, tests, artifact size, ABI/API compatibility, and performance.
9. Provide rollback to the prior pinned version.
10. Remove obsolete toolchain paths after migration.

## Decision points
Use a single fleet-wide version when compatibility permits; support multiple versions only for real consumer/platform constraints. Containers can package toolchains but do not replace explicit version ownership.

## Common failure patterns
Relying on PATH, floating latest tags, forgetting linker/generator versions, silently auto-updating SDKs, and changing compiler plus build flags simultaneously without attribution.

## Verification
Fresh machines bootstrap successfully; reported tool versions match pins; builds reproduce across workers; cache keys change on toolchain upgrades; rollback is tested.

## Expected output
A pinned toolchain manifest, bootstrap path, compatibility evidence, and upgrade/rollback procedure.

## Stop conditions
Stop when required tool licenses prevent automated provisioning, compatibility cannot be established, or an upgrade changes externally governed ABI/artifact contracts without approval.