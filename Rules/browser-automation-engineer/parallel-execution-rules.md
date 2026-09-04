# Parallel Execution Rules

## Purpose
Enable safe browser automation concurrency without data collisions, resource exhaustion, or hidden ordering dependencies.

## Scope
Applies to workers, shards, browser processes, contexts, shared services, test data, ports, files, and CI execution.

## MUST
- Parallel scenarios MUST have isolated mutable browser and test data state.
- Shared resources MUST have explicit concurrency semantics and ownership.
- Worker count MUST be bounded by measured infrastructure, application, and external-service capacity.
- Port, filename, account, namespace, and temporary-resource allocation MUST be collision safe.
- Failures that appear only under concurrency MUST be investigated as concurrency defects rather than automatically serialized away.

## MUST NOT
- Tests MUST NOT rely on execution order unless order is an explicit workflow requirement.
- Concurrent workers MUST NOT mutate the same account or record without a designed coordination mechanism.
- Parallelism MUST NOT be increased based only on shorter wall-clock duration when it destabilizes the system under test or produces misleading load.

## SHOULD
- Sharding SHOULD balance historical runtime while preserving independence.
- Concurrency limits SHOULD be configurable per environment and supported by measurements.

## Exceptions
Serial execution is appropriate for inherently exclusive workflows, but the exclusivity reason and resource boundary must be documented.

## Verification
Run suites with randomized ordering and multiple worker counts, inspect resource allocation, compare failure rates by concurrency, and verify cleanup leaves no cross-worker state.