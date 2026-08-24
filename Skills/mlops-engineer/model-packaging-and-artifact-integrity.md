# Model Packaging and Artifact Integrity

## Purpose
Package models and runtime dependencies into immutable, verifiable deployment artifacts that behave consistently across environments.

## When to use
Use before model registration, serving deployment, edge export, or reproducible batch inference.

## Inputs
Model weights, serialization format, preprocessing/postprocessing code, dependencies, runtime image, hardware target, signature/schema.

## Preconditions
Candidate model has passed functional validation.

## Context to inspect
Build pipeline, package manager, image registry, model format, native libraries, accelerator drivers, and signing capabilities.

## Core knowledge
Artifact integrity spans model bytes, code, dependencies, runtime, and interface. Serialization can alter numerical behavior; native dependencies can create hidden platform coupling.

## Procedure
1. Define the deployment contract and model signature.
2. Pin dependencies and base runtime.
3. Package preprocessing and postprocessing consistently.
4. Generate immutable digests for all deployable artifacts.
5. Produce SBOM/provenance where supported.
6. Scan dependencies and images.
7. Sign artifacts when policy requires it.
8. Load and execute in a clean target-like environment.
9. Compare outputs with the validated candidate.
10. Store artifacts in controlled registries with retention.

## Decision points
Portable format vs framework-native runtime; model bundled with code vs independently versioned components; CPU vs accelerator-specific builds.

## Common failure patterns
Pickled local environments, floating dependency versions, unsigned mutable tags, omitted preprocessing, ABI mismatches, and conversion-induced accuracy loss.

## Verification
Rebuild and redeploy from source references; verify digests, signature, loadability, output tolerance, and vulnerability policy.

## Expected output
Immutable package, digest/signature, runtime manifest, compatibility matrix, and verification evidence.

## Stop conditions
Stop if artifact provenance is unknown, critical vulnerabilities are unresolved, or target-runtime outputs exceed approved tolerance.