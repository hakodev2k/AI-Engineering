# Reproducible and Hermetic Builds

## Purpose
Reduce hidden build inputs and make artifact production independently auditable by controlling environmental dependencies and sources of nondeterminism.

## When to use
Use for high-assurance releases, provenance programs, unexplained artifact drift, or build-environment hardening.

## Inputs
Build scripts, toolchains, dependency locks, environment variables, network dependencies, timestamps, generated files, and artifact comparison tools.

## Context to inspect
Identify every build input: source, compiler, SDK, OS image, dependencies, locale, time, random seeds, network downloads, and injected metadata.

## Core knowledge
Hermeticity constrains undeclared inputs; reproducibility means equivalent declared inputs can yield equivalent outputs. They are related but distinct security properties.

## Procedure
1. Record the complete declared build input set.
2. Pin toolchains and dependency resolution.
3. Remove or explicitly model network access during builds.
4. Normalize timestamps, paths, locale, ordering, and random inputs where feasible.
5. Isolate builds from developer machine state.
6. Produce artifacts in clean environments.
7. Rebuild independently and compare outputs or normalized digests.
8. Investigate differences to the smallest divergent component.
9. Document unavoidable nondeterminism and its security implications.
10. Integrate reproducibility checks for critical releases.

## Decision points
Full byte-for-byte reproducibility may be costly; prioritize artifacts where compromise impact justifies it. Hermetic builds often deliver security value even when some final packaging remains nondeterministic.

## Common failure patterns
Downloading `latest` tools; depending on local caches; embedding timestamps; claiming reproducibility after repeated builds on the same persistent runner; ignoring generated dependencies.

## Verification
Build the same revision in independent clean environments and compare outputs. Confirm undeclared network or filesystem dependencies fail rather than silently resolve.

## Expected output
A documented, testable build-input model with measured reproducibility.

## Stop conditions
Escalate when critical inputs cannot be pinned, external services inject unverifiable content, or unexplained binary differences persist.