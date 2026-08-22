# Source Ingestion Rules
## Purpose
Make ingestion reliable, traceable, and safe across changing upstream systems.
## Scope
Batch imports, CDC, APIs, files, streams, and external source connectors.
## MUST
- Every source MUST have an owner, extraction method, expected cadence, retry policy, and failure behavior.
- Ingestion MUST preserve source identifiers and enough metadata to support replay and reconciliation.
- Schema drift MUST be detected before incompatible data silently reaches downstream consumers.
- Credentials and connection secrets MUST use approved secret-management mechanisms.
## MUST NOT
- MUST NOT discard failed records without durable evidence and recovery handling.
- MUST NOT assume upstream availability, ordering, or uniqueness unless the source guarantees it.
- MUST NOT mutate source data as a side effect of read-only ingestion without explicit approval.
## SHOULD
- Prefer idempotent ingestion and checkpointing for restartability.
- Prefer bounded retries with backoff and dead-letter handling when practical.
## Exceptions
Exceptions require source constraints, failure impact, recovery plan, and owner approval.
## Verification
Inspect connector configuration, checkpoints, retry behavior, drift tests, secrets handling, and reconciliation evidence.