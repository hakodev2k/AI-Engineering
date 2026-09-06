# Delivery Semantics Rules

## Purpose
Make duplicate, loss, and acknowledgement behavior explicit and safe.

## Scope
At-least-once, effectively-once, acknowledgements, retries, checkpoints, and sink commits.

## MUST
- Delivery semantics MUST be documented end to end, not only for one component.
- Checkpoints MUST advance only after the required downstream durability point.
- At-least-once pipelines MUST assume duplicates can occur.
- Claims of exactly-once or effectively-once behavior MUST be supported by failure tests.
- Retry behavior MUST preserve event identity or equivalent deduplication evidence.

## MUST NOT
- MUST NOT acknowledge before durability when doing so can lose changes.
- MUST NOT market component-level guarantees as end-to-end guarantees.
- MUST NOT suppress duplicate detection merely to improve apparent throughput.

## SHOULD
- Prefer idempotent sinks and deterministic event identities.
- Test failures between write and acknowledgement.

## Exceptions
Weaker guarantees require explicit consumer acceptance and documented loss/duplication bounds.

## Verification
Run fault-injection tests around acknowledgements, restarts, retries, and sink commits; inspect checkpoint progression.