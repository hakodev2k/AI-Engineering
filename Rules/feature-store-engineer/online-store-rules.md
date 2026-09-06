# Online Store Rules

## Purpose
Serve low-latency feature values with predictable freshness, correctness, and failure behavior.

## Scope
Online key-value stores, cache layers, replication, TTLs, serialization, and serving reads.

## MUST
- Online feature records MUST include enough metadata to determine version and freshness when required.
- TTLs MUST align with feature semantics rather than arbitrary storage defaults.
- Read latency and availability targets MUST be defined for production use cases.
- Serialization formats MUST be versioned or backward-compatible.
- Online writes MUST be idempotent or otherwise safe under retries.

## MUST NOT
- MUST NOT serve indefinitely stale values without an explicit stale-data policy.
- MUST NOT make online-store schema changes that break active consumers without migration.
- MUST NOT expose cross-tenant feature values through shared keys or cache collisions.

## SHOULD
- Use bounded fallback behavior for transient store failures where product semantics allow it.
- Separate hot-path payloads from large non-serving metadata.

## Exceptions
Exceptions require documented latency, consistency, and risk trade-offs.

## Verification
Inspect TTL configuration, load tests, serialization compatibility tests, retry tests, and tenant-isolation tests.