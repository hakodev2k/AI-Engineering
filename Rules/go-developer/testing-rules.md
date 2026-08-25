# Testing Rules

## Purpose
Provide reliable evidence that Go behavior and critical invariants are protected.

## Scope
Unit, integration, contract, regression, fuzz, and concurrency tests.

## MUST
- Critical behavior and regression fixes MUST have automated protection at the appropriate layer.
- Tests MUST be deterministic under normal CI execution.
- Concurrency-sensitive code MUST include race, cancellation, or stress coverage where risk warrants it.
- Tests MUST assert externally meaningful behavior rather than incidental implementation details.

## MUST NOT
- MUST NOT use arbitrary sleeps as the primary synchronization mechanism in deterministic tests.
- MUST NOT hide flaky tests behind unlimited retries.
- MUST NOT mock boundaries whose real protocol behavior is the subject of the test.

## SHOULD
- Use table-driven tests where cases share behavior clearly.
- Use fuzzing for parsers, codecs, validators, and other high-input-space logic.

## Exceptions
Non-deterministic system tests require bounded retry policy, captured evidence, and ownership.

## Verification
Run `go test ./...`, `go test -race ./...` where feasible, fuzz targets, CI history, and coverage of critical paths.