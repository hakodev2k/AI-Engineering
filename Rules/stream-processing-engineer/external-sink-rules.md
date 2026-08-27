# External Sink Integration
## Purpose
Protect downstream systems and preserve output correctness.
## Scope
Databases, APIs, object stores, search systems, and other sinks.
## MUST
- Sink writes MUST define idempotency, timeout, retry, ordering, batching, and partial-failure semantics.
- Sink capacity MUST be validated against peak and recovery traffic.
- Side effects MUST have a reconciliation or audit strategy when correctness is material.
## MUST NOT
- Unbounded retries MUST NOT overload a degraded sink.
- Acknowledgement MUST NOT advance past unrecoverable writes unless loss is explicitly accepted.
## SHOULD
- Bulk operations SHOULD have bounded batch size and failure isolation.
## Exceptions
Non-idempotent sinks require explicit duplicate-risk controls and owner acceptance.
## Verification
Fault-inject timeouts, throttling, partial writes, duplicates, and sink outages; reconcile resulting outputs.