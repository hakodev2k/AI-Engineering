# Serverless Rules
## Purpose
Build safe, bounded, and observable serverless workloads.
## Scope
Lambda, API Gateway, event sources, concurrency, retries, destinations, and serverless configuration.
## MUST
- Define timeout, memory, concurrency, retry, and failure-destination behavior for production functions.
- Make event handlers idempotent when delivery semantics can produce duplicates.
- Bound downstream concurrency so scaling cannot overwhelm dependencies.
- Validate cold-start and package/runtime behavior against latency objectives.
## MUST NOT
- Assume an event is delivered exactly once unless the complete architecture guarantees it.
- Allow unbounded retries for poison events or permanent failures.
## SHOULD
- Keep functions stateless and externalize durable state.
## Exceptions
Non-idempotent processing requires explicit duplicate-prevention or reconciliation design.
## Verification
Inspect function configuration, event-source settings, DLQs/destinations, concurrency, load tests, duplicate-event tests, logs, and alarms.