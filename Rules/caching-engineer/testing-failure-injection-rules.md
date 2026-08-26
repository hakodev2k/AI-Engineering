# Testing and Failure Injection

## Purpose
Validate cache behavior under concurrency, stale data, and infrastructure failure rather than only happy paths.

## Scope
Unit, integration, load, race, chaos, and recovery tests.

## MUST
- Critical cache logic MUST be tested for hit, miss, expiry, invalidation, malformed value, timeout, and unavailable-cache behavior.
- Concurrency-sensitive flows MUST test races between refill, mutation, invalidation, and expiry.
- Failure tests MUST verify bounded retries and protection of authoritative dependencies.
- Tests MUST assert business correctness, not only cache command success.

## MUST NOT
- Flaky timing sleeps MUST NOT be the sole method for validating expiry or concurrency semantics when deterministic controls are possible.
- Mocks MUST NOT be the only evidence for platform-specific failover or serialization behavior.
- Failure injection MUST NOT be run against production without approved blast-radius controls.

## SHOULD
- Use controllable clocks and deterministic fault injection where practical.
- Preserve regression tests for cache-related incidents.

## Exceptions
Document untestable assumptions, residual risk, alternate evidence, and owner.

## Verification
Inspect test suites, CI results, chaos reports, race tests, coverage of incident regressions, and failure-mode assertions.