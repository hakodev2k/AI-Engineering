# Hermetic and Reproducible Builds

## Purpose
Make builds depend only on declared inputs so identical inputs produce equivalent outputs across machines and time.

## When to use
Use for CI drift, supply-chain hardening, remote execution, artifact provenance, or unexplained local-versus-CI differences.

## Inputs
Build definitions, toolchain versions, environment variables, dependency locks, network accesses, timestamps, generated metadata, and representative artifacts.

## Context to inspect
Identify reads outside the workspace, ambient PATH/tool discovery, locale/timezone dependence, network downloads, random seeds, absolute paths, host metadata, and non-pinned dependencies.

## Core knowledge
Hermeticity controls inputs; reproducibility controls outputs. They are related but distinct. Reproducible output may require canonical ordering, stable timestamps, deterministic archives, fixed seeds, and path normalization. Network access during execution is a major hidden input.

## Procedure
1. Capture a baseline artifact hash and build environment.
2. Inventory all explicit and ambient inputs.
3. Pin compilers, SDKs, package managers, plugins, and dependency graphs.
4. Move dependency acquisition into controlled fetch/resolution phases.
5. Remove undeclared network and host filesystem reads.
6. Normalize locale, timezone, paths, timestamps, ordering, and randomness where relevant.
7. Isolate build actions in sandboxes or containers without treating containers alone as proof of hermeticity.
8. Rebuild on clean independent workers.
9. Compare artifacts semantically and byte-for-byte where appropriate.
10. Document intentional nondeterministic fields and eliminate them where feasible.

## Decision points
Require byte-identical artifacts when signing, provenance, or caching depends on exact bytes. Semantic reproducibility may suffice when downstream formats legitimately embed nondeterministic metadata, but document the exception.

## Common failure patterns
Floating dependency versions, timestamps in archives, host-specific absolute paths, unpinned base images, locale-sensitive generators, network calls hidden in scripts, and assuming lockfiles pin the toolchain itself.

## Verification
Build the same revision on at least two clean workers; compare dependency resolution, action inputs, and output hashes; repeat after cache eviction; verify denied network access does not break execution phases.

## Expected output
A reproducibility assessment, eliminated hidden inputs, pinned toolchain/dependencies, and evidence showing the reproducibility level achieved.

## Stop conditions
Stop if required dependencies cannot legally or technically be mirrored/pinned, signing infrastructure intentionally injects nondeterminism, or changing artifact bytes requires consumer approval.