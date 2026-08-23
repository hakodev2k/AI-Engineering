# Gradle Build Engineering

## Purpose
Keep Android builds reproducible, understandable, fast, and safe across local development and CI.

## When to use
Use for build slowdown, dependency conflicts, plugin upgrades, convention plugins, CI inconsistency, or multi-module build maintenance.

## Inputs
Gradle files, version catalog, plugin versions, module graph, CI logs, build scans/profiles, JDK/AGP/Kotlin versions.

## Preconditions
Reproduce with the same toolchain and distinguish configuration time, task execution, dependency resolution, and test time.

## Context to inspect
settings.gradle, build files, convention plugins, repositories, dependency scopes, annotation/code generation, configuration cache, parallelism, and CI caching.

## Core knowledge
Build performance and reliability depend on dependency graph shape, task inputs/outputs, configuration avoidance, toolchain compatibility, and cache correctness. Hidden environment dependencies undermine reproducibility.

## Procedure
1. Record current JDK, Gradle, AGP, Kotlin, and plugin versions.
2. Capture a baseline build profile for representative clean/incremental workflows.
3. Inspect dependency and plugin duplication.
4. Move repeated configuration into convention plugins where it reduces drift.
5. Use narrow dependency scopes and avoid leaking implementation dependencies.
6. Enable configuration/build caching only after verifying task correctness.
7. Remove non-deterministic task inputs and undeclared outputs.
8. Validate generated-code and annotation-processing costs.
9. Upgrade toolchains in compatible increments with release notes/tests.
10. Compare local and CI outcomes after changes.

## Decision points
Split modules for ownership/build isolation only when graph overhead remains justified. Prefer KSP or other tooling changes only after compatibility and measured benefit are established.

## Common failure patterns
Dynamic versions, repository drift, excessive kapt use, eager task configuration, environment-specific scripts, cache poisoning, and large shared build logic with hidden side effects.

## Verification
Run clean and incremental builds, dependency resolution, tests, and CI on a fresh environment. Compare timing and cache hit behavior to baseline.

## Expected output
Reproducible toolchain, simplified build configuration, measured performance evidence, and documented compatibility constraints.

## Stop conditions
Escalate when upgrades require breaking source changes across teams, proprietary plugins block compatibility, or cache correctness cannot be proven.