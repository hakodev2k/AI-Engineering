# Stream Processing Rules
## Purpose
Keep streaming pipelines correct under out-of-order delivery, duplication, and partial failure.
## Scope
Event streams, brokers, consumers, windows, state stores, and stream joins.
## MUST
- Delivery guarantees, ordering assumptions, keys, and event-time semantics MUST be explicit.
- Stateful processing MUST define checkpoint, recovery, and state-retention behavior.
- Late and duplicate events MUST be handled according to business semantics.
- Backpressure and lag MUST be observable for critical streams.
## MUST NOT
- MUST NOT assume exactly-once business effects merely because a framework advertises exactly-once processing.
- MUST NOT drop late events silently when they can affect governed outputs.
## SHOULD
- Prefer idempotent sinks and replayable source retention.
## Exceptions
Simplified semantics require documented impact and consumer agreement.
## Verification
Use replay tests, duplicate/out-of-order tests, lag metrics, checkpoint recovery, and sink reconciliation.