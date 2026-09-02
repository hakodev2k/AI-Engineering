# Reproducible Computation

## Purpose
Make scientific computations repeatable across runs, machines, environments, and collaborators with explicit control of inputs, software, randomness, and execution metadata.

## When to use
Use for publishable analyses, regulated workflows, model comparison, production scientific services, or any result that must be independently reproduced.

## Inputs
Source code, dependencies, datasets, configuration, random seeds, hardware/runtime information, and expected outputs.

## Context to inspect
Environment management, containerization, dependency locks, data versions, nondeterminism, parallel reductions, compiler flags, and external services.

## Core knowledge
Reproducibility requires more than version-controlled source. Data, parameters, dependency versions, build flags, random-state policy, and execution metadata all affect results.

## Procedure
1. Identify all inputs affecting the result.
2. Pin or record software and toolchain versions.
3. Version datasets and reference assets.
4. Externalize configuration and record effective values.
5. Define random seed and parallel nondeterminism policy.
6. Capture hardware and runtime metadata where material.
7. Automate environment creation.
8. Produce checksums or fingerprints for key outputs.
9. Re-run from a clean environment.
10. Document acceptable cross-platform numeric variation.

## Decision points
Use containers when environment portability dominates; use native environment locks when hardware integration or accelerator stacks make containers impractical.

## Common failure patterns
Unpinned dependencies, mutable input files, hidden notebook state, implicit environment variables, and claiming reproducibility from a single same-machine rerun.

## Verification
Reproduce results from a clean checkout and environment, compare output fingerprints or domain tolerances, and validate that all required inputs are discoverable.

## Expected output
A reproducible execution recipe, dependency/data manifest, metadata capture policy, and verification evidence.

## Stop conditions
Escalate when critical dependencies or datasets cannot be versioned, accessed, or legally redistributed as required.