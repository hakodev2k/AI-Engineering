# Backpressure and Flow Control
## Purpose
Keep overload bounded and prevent cascading failure.
## Scope
Backpressure, queues, buffers, rate limits, and admission control.
## MUST
- Pipelines MUST have bounded buffering or an explicit durable overflow strategy.
- Backpressure propagation and overload behavior MUST be tested at sustained and burst traffic levels.
- Operators MUST expose lag or equivalent pressure indicators.
## MUST NOT
- Memory growth MUST NOT be used as an implicit unbounded queue.
- Retries MUST NOT amplify overload without rate controls.
## SHOULD
- Degradation SHOULD favor controlled lag or shedding according to business priority.
## Exceptions
Intentional unbounded retention requires durable storage and capacity governance.
## Verification
Load test beyond steady-state capacity and inspect memory, queue depth, lag, throughput, and recovery.