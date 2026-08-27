# Cross-Platform Builds

## Purpose
Design build definitions that behave consistently across supported operating systems, architectures, and target platforms.

## When to use
Use when adding OS/architecture support, consolidating divergent scripts, or diagnosing platform-only failures.

## Inputs
Supported host/target matrix, toolchains, platform APIs, filesystem semantics, artifact formats, and CI coverage.

## Context to inspect
Inspect path handling, case sensitivity, line endings, shell assumptions, executable suffixes, symlinks, permissions, architecture flags, and host-versus-target distinctions.

## Core knowledge
Host platform, execution platform, and target platform may differ. Build logic should model these explicitly. Portable build descriptions avoid shell-specific behavior unless isolated behind platform adapters.

## Procedure
1. Define supported host/execution/target combinations.
2. Inventory platform-specific assumptions.
3. Separate portable target logic from platform adapters.
4. Normalize path and environment handling through build-system APIs.
5. Select toolchains by explicit platform constraints.
6. Isolate platform-specific sources and linker options.
7. Ensure generated artifacts use stable encodings/line endings where required.
8. Add CI coverage for meaningful matrix combinations.
9. Test cross-compilation and native compilation where applicable.
10. Document unsupported combinations rather than allowing accidental behavior.

## Decision points
Use cross-compilation when toolchain support is mature and runtime tests can execute elsewhere; use native workers when platform tooling/signing requires them.

## Common failure patterns
Conflating host and target, case-only filename collisions, shell-specific scripts, architecture flags leaking between targets, and CI covering only one filesystem behavior.

## Verification
Build representative targets on each supported host/target combination; run platform tests; compare expected artifact metadata; validate clean bootstrap.

## Expected output
An explicit platform matrix, portable build logic, isolated platform adaptations, and CI evidence.

## Stop conditions
Stop when required proprietary toolchains or signing environments are unavailable, or a platform contract is undefined by product owners.