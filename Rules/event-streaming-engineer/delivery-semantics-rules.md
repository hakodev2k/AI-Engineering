# Delivery Semantics Rules

## Purpose
Make duplicate, loss, and processing guarantees explicit and achievable end to end.

## Scope
Applies to at-most-once, at-least-once, effectively-once, and transactional processing claims.

## MUST
- Delivery guarantees MUST be defined end to end, including source, broker, processor, sink, retries, and failure recovery.
- At-least-once consumers MUST make duplicate effects safe through idempotency, deduplication, or equivalent controls where duplicates matter.
- Offset or checkpoint advancement MUST occur only at a point consistent with the documented processing guarantee.
- Exactly-once claims MUST identify the precise transactional boundary and unsupported external side effects.
- Failure tests MUST exercise crashes before and after side effects and checkpoint commits.

## MUST NOT
- MUST NOT equate broker-level exactly-once features with exactly-once business outcomes automatically.
- MUST NOT acknowledge messages before durable required effects if loss is unacceptable.
- MUST NOT rely on retries as a substitute for idempotency.
- MUST NOT describe a system as lossless without evidence covering configured durability and failure modes.

## SHOULD
- Prefer simple at-least-once plus idempotent effects when it satisfies business requirements.
- Deduplication state SHOULD have explicit retention and collision semantics.

## Exceptions
Weaker guarantees require documented business acceptance, quantified loss/duplicate exposure, and monitoring.

## Verification
Use fault-injection tests, duplicate/replay tests, transaction-boundary review, checkpoint inspection, and sink reconciliation.