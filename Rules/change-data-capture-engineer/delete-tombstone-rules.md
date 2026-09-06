# Delete and Tombstone Rules

## Purpose
Represent deletion accurately across logs, compacted streams, caches, and derived stores.

## Scope
Deletes, tombstones, soft deletes, key deletion, compaction, and retention.

## MUST
- Delete semantics MUST be explicit in the event contract.
- Hard delete, soft delete, and tombstone meanings MUST be distinguishable where relevant.
- Compaction behavior MUST preserve enough information to remove stale downstream state.
- Delete events MUST retain the key required to identify affected state.
- Privacy-driven deletion workflows MUST account for retained CDC data and downstream replicas.

## MUST NOT
- MUST NOT translate deletion into a null-valued update unless the contract explicitly defines that meaning.
- MUST NOT drop tombstones before all required consumers can observe them.
- MUST NOT retain prohibited personal data indefinitely in replay logs.

## SHOULD
- Test deletion after consumer downtime and replay.
- Document retention interactions with compaction.

## Exceptions
Delete suppression requires documented downstream behavior and compliance approval where sensitive data is involved.

## Verification
Run delete/replay tests, inspect compacted topics, validate downstream removal, and review retention configuration.