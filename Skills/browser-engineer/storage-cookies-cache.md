# Storage, Cookies, and Cache

## Purpose
Implement and debug browser persistence with correct partitioning, quota, privacy, consistency, and eviction behavior.

## When to use
Use for cookies, HTTP cache, web storage, IndexedDB-like stores, quota, partitioning, or data-clearing bugs.

## Inputs
Storage scenario, origin/site context, policy, disk state, logs, quota and eviction metrics.

## Context to inspect
Storage keys, partitions, cookie rules, cache keys, quota manager, transactions, eviction, clear-data paths.

## Core knowledge
Browser storage is both a data system and privacy boundary. Keys may include origin/site/top-level context. Persistence must survive crashes without exposing data across principals.

## Procedure
1. Identify data type, owner principal, and lifetime.
2. Derive the complete storage/cache key.
3. Inspect transactional and crash-consistency guarantees.
4. Check quota and eviction semantics.
5. Verify private/incognito behavior.
6. Exercise clear-site-data and user deletion.
7. Test concurrent readers/writers and process crashes.
8. Measure disk, startup, and lookup cost.

## Decision points
Persist only when user value exceeds privacy/storage cost. Partition state where cross-site linkage is not required. Use transactional storage for multi-record invariants.

## Common failure patterns
Incomplete partition keys; stale cache reuse; deletion leaving auxiliary data; unbounded disk growth; corruption after crash; private data reaching persistent disk.

## Verification
Persistence, partitioning, eviction, deletion, crash-recovery, and privacy tests pass.

## Expected output
Correct storage behavior with explicit ownership, lifetime, and privacy guarantees.

## Stop conditions
Stop when retention requirements conflict with privacy policy or destructive migration requires explicit approval.