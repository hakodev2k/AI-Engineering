# Parallel Test Execution

## Purpose
Reduce feedback time while preserving isolation and determinism under concurrent execution.

## When to use
Use when suites exceed runtime targets or CI capacity can execute tests concurrently.

## Inputs
Suite structure, resource model, test data strategy, worker capacity, environment constraints.

## Context to inspect
Shared accounts, ports, files, databases, queues, rate limits, browser contexts, cleanup, ordering assumptions, and external quotas.

## Core knowledge
Parallelism exposes hidden coupling. Each worker needs isolated state or explicitly coordinated immutable resources. More workers stop helping when the system or dependencies saturate.

## Procedure
1. Measure baseline runtime and bottlenecks.
2. Identify shared mutable resources.
3. Make test identities/data unique per worker.
4. Isolate browser/session/process state.
5. Remove ordering dependencies.
6. Partition suites by balanced historical duration.
7. Cap concurrency below environment/dependency saturation.
8. Preserve per-test artifacts and correlation IDs.
9. Stress repeated parallel runs.
10. Tune worker count from measured throughput, not assumptions.

## Decision points
Use process isolation for unsafe libraries; use logical namespaces when infrastructure supports tenancy. Serialise only tests that genuinely require exclusive resources.

## Common failure patterns
Increasing workers blindly, shared accounts, cleanup deleting another test's data, rate-limit storms, port/file collisions, relying on execution order.

## Verification
Compare serial and parallel outcomes, repeat under maximum planned concurrency, and verify no increase in flake rate or environment errors.

## Expected output
A concurrency-safe suite with measured optimal worker count and documented exclusive resources.

## Stop conditions
Escalate when environment capacity or third-party quotas make required parallelism unsafe.