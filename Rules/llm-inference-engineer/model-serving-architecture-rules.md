# Model Serving Architecture Rules

## Purpose
Define safe, scalable, and maintainable architecture for production LLM inference systems.

## Scope
Applies to inference gateways, model servers, worker pools, routing, control planes, data planes, and external model-serving dependencies.

## MUST
- Serving architecture MUST separate request admission, routing, execution, and observability responsibilities when they have different scaling or failure characteristics.
- Model-serving components MUST have explicit ownership, interfaces, failure modes, and rollback boundaries.
- Stateful components such as session stores, KV caches, and model registries MUST define durability, consistency, and eviction behavior.
- Critical request paths MUST define timeout, retry, cancellation, and backpressure semantics end to end.
- Architecture changes affecting availability, latency, cost, or compatibility MUST include measurable acceptance criteria.
- Multi-model systems MUST define deterministic routing behavior and safe handling for unavailable or incompatible models.

## MUST NOT
- MUST NOT couple control-plane failure directly to healthy in-flight inference execution without a documented reason.
- MUST NOT make model selection depend on hidden mutable state that cannot be inspected during incidents.
- MUST NOT introduce a new serving hop without measuring its latency and failure contribution.
- MUST NOT rely on a single undocumented component as a production availability dependency.

## SHOULD
- Serving systems SHOULD prefer stateless request handling where state is not required.
- Architecture SHOULD support partial degradation rather than total failure when feasible.
- Components SHOULD expose stable contracts so model runtimes or vendors can be replaced independently.

## Exceptions
Exceptions MUST document the constraint, risk, alternatives considered, expected lifetime, and verification evidence. High-risk production exceptions require human approval.

## Verification
Review architecture diagrams, dependency graphs, timeout and retry configuration, failure-mode tests, load-test evidence, and rollback procedures. Confirm each critical component can be traced to an owner and operational runbook.