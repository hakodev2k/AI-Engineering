# Data Integrity Rules
## Purpose
Prevent local or synchronized mobile state from becoming silently inconsistent.
## Scope
Persistence constraints, derived state, identifiers, atomic updates, corruption, and reconciliation.
## MUST
- Invariants that protect durable data MUST be enforced at the strongest practical boundary, not only by UI sequencing.
- Multi-record local changes requiring atomicity MUST use transaction or equivalent consistency mechanisms.
- Corrupt or incompatible persisted state MUST fail predictably with recovery behavior.
## MUST NOT
- Derived cached values MUST NOT become independent authorities when they can diverge from source data.
- Partial persistence failures MUST NOT be reported as complete success.
## SHOULD
- Stable identifiers SHOULD survive synchronization and display reordering.
## Exceptions
Eventually consistent derived views may lag when the product explicitly tolerates it.
## Verification
Test transaction failure, process termination mid-write, corrupted records, concurrent updates, sync reconciliation, and invariant checks.