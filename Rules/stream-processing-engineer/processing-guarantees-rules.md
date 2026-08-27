# Processing Guarantees
## Purpose
Make delivery and processing semantics explicit and testable.
## Scope
At-most-once, at-least-once, effectively-once, and exactly-once designs.
## MUST
- Every stateful pipeline MUST document its processing guarantee end to end, including sources and sinks.
- Claims of exactly-once behavior MUST identify the transaction or deduplication boundary and failure assumptions.
- Duplicate-sensitive effects MUST be idempotent or protected by durable deduplication.
## MUST NOT
- Broker delivery guarantees MUST NOT be presented as end-to-end processing guarantees without sink analysis.
## SHOULD
- Prefer the weakest guarantee that safely satisfies business invariants.
## Exceptions
Any weaker guarantee requires quantified impact and explicit owner acceptance.
## Verification
Inject failures before and after checkpoints and sink writes; inspect duplicates, loss, and replay outcomes.