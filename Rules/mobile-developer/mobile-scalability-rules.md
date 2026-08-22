# Mobile Scalability Rules
## Purpose
Ensure client behavior remains efficient as users, data volume, feature count, and backend load grow.
## Scope
Pagination, synchronization, local data sets, request fan-out, startup work, and high-volume events.
## MUST
- Potentially unbounded remote collections MUST use pagination, streaming, or bounded windows.
- Client behavior that multiplies backend calls per item/user MUST be assessed for fan-out at realistic scale.
- Local queries over growing durable datasets MUST have measured performance and appropriate indexing where applicable.
## MUST NOT
- Entire server datasets MUST NOT be downloaded merely to filter or aggregate locally when scale can exceed device limits.
- Startup MUST NOT perform work proportional to unbounded historical data.
## SHOULD
- Synchronization SHOULD use deltas/checkpoints rather than full refresh when scale and protocol support justify it.
## Exceptions
Small bounded reference datasets may be fully cached with documented size limits.
## Verification
Load-test representative large accounts, profile local queries, count requests, measure sync payloads, and test startup with aged data.