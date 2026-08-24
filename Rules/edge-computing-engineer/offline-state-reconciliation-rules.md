# Offline State Reconciliation
## Purpose
Preserve correctness when independent edge state later converges.
## Scope
Locally mutable state synchronized with remote systems.
## MUST
- Every mutable data class MUST define authority, conflict semantics, ordering assumptions, and reconciliation behavior.
- Reconciliation MUST be deterministic for the same inputs.
- Irrecoverable conflicts MUST be surfaced with sufficient evidence for resolution.
## MUST NOT
- MUST NOT use last-write-wins implicitly for business-critical data.
- MUST NOT overwrite authoritative state without provenance or conflict checks.
## SHOULD
- Domain-specific merge rules SHOULD be preferred over generic timestamp resolution.
## Exceptions
Simplified conflict handling requires bounded impact and documented acceptance.
## Verification
Use deterministic conflict fixtures, clock-skew tests, duplicate events, and replay tests.