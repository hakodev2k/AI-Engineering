# Local Data Storage Rules

## Purpose
Protect integrity, confidentiality, migration safety, and performance of on-device data.

## Scope
Applies to databases, preferences, files, caches, and persisted application state.

## MUST
- Classify persisted data by durability and sensitivity before selecting storage.
- Define schema migration paths for durable structured data and test upgrades from supported versions.
- Perform potentially expensive storage I/O away from the main thread.
- Apply transactional boundaries when multiple writes must commit atomically.
- Define deletion behavior for logout, account removal, retention expiry, and cache eviction as applicable.

## MUST NOT
- Store secrets or sensitive user data in plaintext merely for implementation convenience.
- Use destructive migration as a default for user-owned durable data.
- Treat cache as the sole authoritative copy of irreplaceable user data.

## SHOULD
- Minimize persisted sensitive data and retention duration.
- Index/query based on measured access patterns rather than speculation.

## Exceptions
Destructive migration requires explicit proof that affected data is safely regenerable or approved data-loss acceptance.

## Verification
Run migration tests, inspect schemas and storage locations, benchmark critical queries, test deletion flows, and review encryption/access controls.