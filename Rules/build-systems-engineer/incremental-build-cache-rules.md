# Incremental Build and Cache Rules

## Purpose
Make incremental builds correct before making them fast, and ensure cache hits are based only on complete, stable inputs.

## Scope
Applies to local incremental builds, shared caches, action keys, invalidation, generated outputs, and cache eviction policy.

## MUST
- Cache keys MUST include every input that can affect an action result, including tool versions and relevant configuration.
- A cache hit MUST be interchangeable with executing the action from declared inputs.
- Changes to action-key computation MUST include correctness tests covering invalidation behavior.
- Cache corruption or stale-output incidents MUST have a safe bypass and purge mechanism.
- Incremental correctness MUST be tested against clean builds for representative target sets.

## MUST NOT
- MUST NOT trade invalidation correctness for higher hit rate.
- MUST NOT share cached results across incompatible platforms, toolchains, or configuration domains.
- MUST NOT treat cache hit rate alone as proof of build performance improvement.

## SHOULD
- Cache metrics SHOULD distinguish local, remote, negative, and failed lookups.
- Large outputs SHOULD use content-addressed storage or equivalent deduplication when operationally appropriate.

## Exceptions
Any relaxed cache isolation MUST document compatibility evidence, blast radius, rollback, and monitoring.

## Verification
Compare incremental and clean-build outputs, inspect action keys, run invalidation tests, review cache namespace boundaries, and monitor hit rate together with correctness failures and latency.