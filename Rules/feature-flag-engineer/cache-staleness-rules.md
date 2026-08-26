# Cache and Staleness Rules

## Purpose
Bound the risk created by cached flag state and disconnected evaluation.

## Scope
Local caches, streaming updates, polling, bootstrap snapshots, and offline modes.

## MUST
- Acceptable staleness MUST be defined for high-impact flags.
- Cache behavior MUST specify startup state, refresh policy, expiration, and corruption handling.
- Emergency controls MUST have propagation objectives consistent with incident needs.
- Stale-state behavior MUST be observable.

## MUST NOT
- Cached configuration MUST NOT be treated as current without understanding its age.
- Indefinite stale operation MUST NOT be allowed for security-critical decisions unless explicitly approved.
- Cache refresh failures MUST NOT be silently hidden.

## SHOULD
- Systems SHOULD expose configuration age and last successful synchronization.

## Exceptions
Extended offline operation requires bounded risk, safe defaults, and documented reconciliation.

## Verification
Simulate network partitions, inspect TTL and refresh settings, measure propagation, and review telemetry.