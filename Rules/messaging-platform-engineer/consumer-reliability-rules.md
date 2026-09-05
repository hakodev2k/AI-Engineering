# Consumer Reliability Rules

## Purpose
Ensure consumers process messages safely across crashes, rebalances, retries, and dependency failures.

## Scope
Consumer groups, acknowledgements, offsets, checkpoints, handlers, and shutdown behavior.

## MUST
- Consumers MUST acknowledge or commit progress only after required durable processing completes.
- Shutdown and rebalance paths MUST prevent avoidable duplicate or lost processing.
- Processing failures MUST preserve diagnostic context and route through defined retry or failure handling.
- Long-running handlers MUST account for broker lease, heartbeat, or visibility semantics.

## MUST NOT
- MUST NOT swallow unexpected processing exceptions.
- MUST NOT advance offsets past unprocessed required work unless an explicit skip policy exists.
- MUST NOT assume rebalances cannot interrupt processing.

## SHOULD
- Keep handlers bounded and isolate external dependency latency from broker liveness where practical.

## Exceptions
Skip policies require documented criteria, auditability, and business approval for loss.

## Verification
Review acknowledgement code, rebalance tests, crash tests, offset behavior, and consumer lag.