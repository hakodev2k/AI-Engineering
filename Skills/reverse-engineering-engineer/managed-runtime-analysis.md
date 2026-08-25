# Managed Runtime Analysis

## Purpose
Analyze applications compiled for managed runtimes by combining metadata, bytecode/IL, decompilation, reflection artifacts, and runtime behavior.

## When to use
Use for .NET, JVM, Android bytecode, or similar managed targets where metadata and runtime services materially affect semantics.

## Inputs
Assemblies/packages, runtime version, metadata, bytecode/IL, configuration, symbols/maps if available.

## Preconditions
Identify runtime, target framework/version, architecture, and whether ahead-of-time compilation, obfuscation, or trimming is present.

## Context to inspect
Type metadata, methods, generics, annotations/attributes, resources, manifests, dependencies, reflection, dynamic loading, native interop, generated code, and configuration.

## Core knowledge
Managed binaries often retain rich semantic metadata, but reflection, dynamic proxies, bytecode rewriting, obfuscation, JIT/AOT compilation, and native interop can hide behavior from straightforward decompilation.

## Procedure
1. Inventory assemblies/modules and dependency graph.
2. Recover type and method metadata before reading decompiled source.
3. Identify entry points, frameworks, generated code, and dependency injection wiring.
4. Trace reflection and dynamic loading paths.
5. Inspect bytecode/IL where decompiler output is ambiguous.
6. Map managed-to-native boundaries and serialization contracts.
7. Identify obfuscation, trimming, or AOT artifacts.
8. Validate important paths under the runtime with controlled tracing.
9. Document runtime/version assumptions.

## Decision points
Prefer metadata and decompilation for ordinary code; inspect IL/bytecode for subtle semantics; use runtime instrumentation for reflection, JIT-generated, or environment-dependent behavior.

## Common failure patterns
Treating decompiled source as original; missing reflection-only call paths; ignoring configuration; assuming native and managed exception semantics are identical.

## Verification
Confirm recovered call paths with metadata/xrefs and representative runtime execution. Ensure dependency versions match the analyzed artifact.

## Expected output
A runtime-aware semantic map with key types, flows, dynamic behavior, and interop boundaries.

## Stop conditions
Stop if required runtime dependencies are unavailable or executing the application cannot be safely isolated.