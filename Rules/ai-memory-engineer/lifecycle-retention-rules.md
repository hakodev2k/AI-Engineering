# Memory Lifecycle and Retention Rules

## Purpose
Control creation, activation, expiry, archival, deletion, and recovery of persistent memory.

## Scope
Retention classes, TTLs, archival, tombstones, deletion propagation, and lifecycle transitions.

## MUST
- Each persistent memory class MUST define retention and deletion behavior.
- Expired or revoked memory MUST be excluded from active retrieval within a defined objective.
- Deletion MUST propagate to replicas, caches, and indexes where policy requires it.
- Lifecycle transitions MUST be auditable for sensitive or high-impact memory.

## MUST NOT
- MUST NOT retain memory indefinitely by default when purpose is time-bounded.
- MUST NOT treat logical deletion as complete if active retrieval paths still expose the record.
- MUST NOT resurrect deleted memory through restore, rebuild, or replay without policy authorization.

## SHOULD
- Prefer explicit retention classes over per-record ad hoc behavior.
- Use tombstones when needed to prevent accidental reintroduction.

## Exceptions
Exceptions require purpose, duration, safeguards, and approval.

## Verification
Inspect retention configuration, purge tests, restore tests, cache/index cleanup, and audit records.