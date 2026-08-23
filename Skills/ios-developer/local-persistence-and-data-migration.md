# Local Persistence and Data Migration

## Purpose
Design reliable on-device persistence and schema/data migrations while protecting user data and application startup.

## When to use
Use for SwiftData/Core Data/database/file storage, offline state, cache persistence, or schema evolution.

## Inputs
Data model, retention requirements, consistency rules, expected volume, encryption/privacy needs, migration history.

## Context to inspect
Store technology, schema versions, threading/isolation, backup policy, cache versus source-of-truth semantics, existing migration tests.

## Core knowledge
Persistent data requires explicit ownership, transactional boundaries, migration compatibility, and recovery behavior. Caches may be disposable; user-created data usually is not.

## Procedure
1. Classify data by durability and sensitivity.
2. Choose storage matching query and consistency needs.
3. Define schema constraints and indexes.
4. Keep persistence operations off latency-sensitive UI paths.
5. Define transaction boundaries.
6. Design forward migrations from every supported installed version.
7. Back up or provide recovery for irreplaceable data.
8. Test migration on realistic store sizes.
9. Instrument migration duration/failures.

## Decision points
Prefer simple files/preferences for small atomic settings; structured stores for relational/query-heavy data. Destructive migration is acceptable only for explicitly disposable caches.

## Common failure patterns
Main-thread I/O, migration only from previous version, schema drift, duplicate records, partial writes, and treating user data as cache.

## Verification
Run clean install, upgrade paths, interrupted migration where applicable, corruption handling, and large-data performance tests.

## Expected output
Versioned persistence with tested migrations, recovery policy, and bounded startup impact.

## Stop conditions
Stop before destructive migration of non-disposable data without explicit product/data-owner approval.