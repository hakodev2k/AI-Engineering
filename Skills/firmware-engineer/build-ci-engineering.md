# Firmware Build and CI Engineering

## Purpose
Make firmware builds reproducible, traceable and continuously verified across supported variants.

## When to use
Use for CI setup, toolchain upgrades, release hardening or build inconsistency.

## Inputs
Build system, toolchain, variants, dependencies, generated sources and release requirements.

## Context to inspect
Compiler versions, flags, dependency locks, environment assumptions, artifact naming and CI stages.

## Core knowledge
Reproducibility requires controlled toolchains and inputs. Firmware artifacts must be traceable to source, configuration and build environment.

## Procedure
1. Enumerate supported targets and variants.
2. Pin or record toolchain/dependency versions.
3. Remove hidden local prerequisites.
4. Treat warnings according to project policy.
5. Run static analysis and tests.
6. Produce map, binary and metadata artifacts.
7. Record source revision and configuration.
8. Compare size budgets.
9. Verify release builds from clean environments.

## Decision points
Containerize toolchains when it materially improves reproducibility; native runners may be preferable when vendor tools or hardware access require them.

## Common failure patterns
Unpinned compilers, generated files drifting, developer-only scripts, variant gaps, missing artifact provenance and CI using different flags from releases.

## Verification
Rebuild from a clean environment and confirm artifact metadata, tests and resource-budget checks.

## Expected output
A repeatable pipeline producing traceable firmware artifacts.

## Stop conditions
Escalate when required proprietary tooling cannot be legally or reliably provisioned in the build environment.