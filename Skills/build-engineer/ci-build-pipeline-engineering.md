# CI Build Pipeline Engineering

## Purpose

Engineer CI build pipelines for correctness, isolation, fast feedback, diagnosability, and safe artifact promotion. This skill is intended for Senior Build Engineers working across repositories and build ecosystems.

## When to use

Use this skill when implementing, reviewing, diagnosing, or modernizing the relevant build capability. Do not apply it mechanically when the current project does not exhibit the corresponding problem.

## Inputs

Repository/build definitions, requirement or incident description, relevant logs, toolchain and dependency versions, CI configuration, target platforms, artifact metadata, and available measurements.

## Preconditions

- Inspect the current repository before assuming language, build system, package manager, CI provider, or release model.
- Preserve project conventions unless evidence shows they are unsafe or materially inadequate.
- Do not expose secrets, weaken release controls, or make destructive changes without authorization.

## Context to inspect

Inspect canonical build entry points, dependency manifests/locks, toolchain declarations, CI workflows, generated-code paths, artifact/publish configuration, caches, platform matrices, and recent relevant changes.

## Core knowledge

A Senior Build Engineer must reason about dependency graphs, hermeticity, reproducibility, incremental invalidation, caching, toolchains, artifact integrity, CI trust boundaries, portability, performance, and operational failure modes. Treat build logic as production engineering infrastructure rather than incidental scripting.

## Procedure

1. Map checkout through validation, packaging, and publication.
2. Separate deterministic build work from deployment work.
3. Maximize safe DAG parallelism.
4. Standardize pinned toolchain bootstrap and restore.
5. Use caches for reusable derived data and artifacts for outputs crossing jobs.
6. Add timeouts, cancellation, structured logs, and narrowly scoped retries.
7. Prevent untrusted contexts from accessing publish credentials.
8. Measure queue time, execution time, critical path, retry rate, and failure causes.

## Decision points

- Split jobs only when parallelism or fault isolation beats startup overhead.
- Retry transient infrastructure failures, never deterministic compile/test failures.

## Common failure patterns

- Hidden or undeclared inputs.
- Machine-specific assumptions.
- Weak error propagation or silent fallback.
- Premature optimization without measurement.
- Missing observability or regression protection.

## Verification

Treat implemented and verified as different states.

- Run the canonical build from a clean checkout or clean workspace.
- Run the relevant focused tests and integration checks.
- Compare incremental and clean behavior when dependency invalidation is involved.
- Record concrete evidence such as timings, hashes, graph changes, logs, or artifact inspection.
- Confirm implementation and verification as separate states.

## Expected output

Produce the requested build-system change or investigation result plus concise evidence: affected targets, commands/checks executed, relevant measurements, trade-offs accepted, and any remaining risk.

## Stop conditions

- Required build inputs, ownership, or acceptance criteria are materially unknown.
- The next step requires privileged production access, destructive release mutation, or a security-policy exception that is not authorized.
- Evidence contradicts the working hypothesis after reasonable reproduction.
- An external dependency or toolchain is unavailable and no approved substitute exists.
- Continuing would require weakening artifact integrity, authorization, provenance, or verification controls.
