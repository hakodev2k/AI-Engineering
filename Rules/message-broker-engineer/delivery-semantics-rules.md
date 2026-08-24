# Delivery Semantics

## Purpose
Make duplicate, loss, and acknowledgement behavior explicit.

## Scope
At-most-once, at-least-once, acknowledgements, commits, and transactional delivery.

## MUST
- Each flow MUST define its delivery guarantee and business consequence of duplicates or loss.
- Acknowledgement MUST occur only after the work required by the chosen guarantee is durably complete.
- Consumers under at-least-once delivery MUST tolerate redelivery.

## MUST NOT
- MUST NOT describe a workflow as exactly-once without end-to-end evidence.
- MUST NOT acknowledge before irreversible processing when loss is unacceptable.

## SHOULD
- Prefer simpler guarantees with application-level idempotency over fragile transport assumptions.

## Exceptions
Document semantics, failure modes, evidence, and approval.

## Verification
Use fault injection, redelivery tests, broker metrics, and state reconciliation.