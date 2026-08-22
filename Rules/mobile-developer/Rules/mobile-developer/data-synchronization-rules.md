# Data Synchronization Rules
## Purpose
Prevent corruption and surprising overwrites when local and remote state diverge.
## Scope
Sync engines, conflict resolution, replication metadata, retries, and multi-device updates.
## MUST
- Synchronization MUST define conflict identity, ordering assumptions, and resolution policy per mutable data class.
- Retried mutations MUST be idempotent or protected by deduplication keys.
- Conflict resolution that can discard user data MUST be observable and recoverable where feasible.
## MUST NOT
- Last-write-wins MUST NOT be adopted implicitly for valuable user data.
- Device clock ordering MUST NOT be trusted when correctness requires globally reliable order.
## SHOULD
- Sync protocols SHOULD preserve tombstones or equivalent deletion intent long enough to prevent resurrection.
## Exceptions
Low-value derived data may use simpler overwrite semantics when documented.
## Verification
Test concurrent edits, duplicate delivery, out-of-order delivery, deletion conflicts, clock skew, and long-offline clients.