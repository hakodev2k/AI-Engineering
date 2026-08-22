# CI Pipeline Design

## Purpose
Design CI pipelines that produce fast, trustworthy release evidence and immutable artifacts.

## When to use
Use when creating, reviewing, or restructuring continuous integration for software that will be released repeatedly.

## Inputs
Repository topology, build commands, test suites, artifact types, dependency graph, security checks, runner capabilities, and delivery targets.

## Preconditions
The project can build non-interactively and required credentials can be scoped to CI identities.

## Context to inspect
Inspect existing workflows, runner images, caches, test duration, flaky jobs, secret access, branch protections, artifact publishing, and duplicated work.

## Core knowledge
CI should fail early on cheap deterministic checks, parallelize independent expensive work, isolate untrusted code from privileged publishing, and produce evidence once for later promotion. Caches improve speed but must not become correctness dependencies.

## Procedure
1. Map required validation from source change to release candidate.
2. Separate validation, build, security, and publish trust levels.
3. Order cheap high-signal checks early.
4. Parallelize independent work within resource limits.
5. Pin runner/toolchain inputs.
6. Scope credentials to the minimum jobs requiring them.
7. Publish immutable artifacts only after required gates pass.
8. Capture test, build, and provenance evidence.
9. Define retry behavior only for demonstrably transient failures.
10. Measure queue time, execution time, failure causes, and flakiness.

## Decision points
Use monorepo path filtering only when dependency boundaries are reliable. Prefer reusable pipeline components when they preserve transparency. Choose hosted versus self-hosted runners based on isolation, performance, network access, and operational burden.

## Common failure patterns
Privileged credentials available to pull-request code, rebuilding during deploy, cache poisoning, blanket retries hiding defects, serialized jobs without dependency need, and pipelines whose green status does not imply releasability.

## Verification
Validate clean runs, failure propagation, least-privilege credentials, artifact immutability, branch protection integration, and measured pipeline latency.

## Expected output
A maintainable CI pipeline that produces trustworthy release candidates and auditable evidence.

## Stop conditions
Stop if untrusted code cannot be isolated from release credentials, mandatory checks are undefined, or runner/network constraints make the proposed design unsafe.