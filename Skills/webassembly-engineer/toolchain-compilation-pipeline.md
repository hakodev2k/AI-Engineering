# Toolchain and Compilation Pipeline

## Purpose
Build reproducible, portable Wasm artifacts from native or managed-language toolchains while controlling features, linking, metadata, and optimization.

## When to use
Use when establishing builds, upgrading compilers, diagnosing codegen/link failures, or supporting multiple targets.

## Inputs
Source language, compiler/SDK, target environment, runtime feature matrix, dependencies, build flags, and artifact requirements.

## Context to inspect
Inspect compiler target triple, sysroot, linker, runtime libraries, feature flags, optimization level, debug settings, reproducibility controls, and dependency versions.

## Core knowledge
Wasm output depends on frontend, optimizer, linker, libc/runtime choice, ABI, target features, and post-processing. Browser, WASI, and custom-host targets differ. Toolchains may enable proposals implicitly.

## Procedure
1. Define target runtime and required feature baseline.
2. Pin compiler, SDK, linker, and critical dependencies.
3. Select the correct target and system interface.
4. Make feature flags explicit.
5. Separate debug and release pipelines.
6. Inspect produced imports/exports and producers metadata.
7. Validate and smoke-test the artifact on target runtimes.
8. Record artifact hashes and build inputs.
9. Compare size/performance before accepting toolchain upgrades.
10. Keep rollback-capable build definitions.

## Decision points
Choose libc/full runtime only when needed; minimal/no-stdlib targets reduce size but increase responsibility. Enable LTO and aggressive optimization after correctness and debugging needs are understood.

## Common failure patterns
Compiling for the wrong environment; accidental runtime-specific imports; hidden feature enablement; non-reproducible dependency resolution; stripping all symbols before production diagnostics are designed.

## Verification
Perform clean rebuilds, compare hashes where reproducibility is expected, validate binaries, run runtime-matrix tests, and inspect imports/features.

## Expected output
A pinned, documented compilation pipeline producing validated artifacts with explicit compatibility assumptions.

## Stop conditions
Stop when required dependencies cannot target Wasm, licensing/provenance is unresolved, or a compiler upgrade changes ABI/runtime requirements without approval.