# Queue and Backpressure Rules

## Purpose
Prevent asynchronous buffering from hiding overload until latency, storage, or recovery becomes unmanageable.

## Scope
Applies to message brokers, task queues, event streams, worker pools, and internal buffering.

## MUST
- Queued systems MUST define acceptable backlog age, depth, processing capacity, and recovery targets.
- Producers MUST receive or infer backpressure before downstream storage or consumers become unsafe.
- Consumers MUST handle duplicate delivery according to the delivery contract.
- Poison messages MUST be isolated with bounded retry and diagnosable failure handling.
- Backlog growth and oldest-message age MUST be observable for critical queues.

## MUST NOT
- MUST NOT use unbounded in-memory queues on critical paths.
- MUST NOT equate successful enqueue with completed business processing when completion semantics matter.
- MUST NOT purge or skip production backlog without explicit impact assessment and human approval for destructive loss.

## SHOULD
- Work SHOULD be partitioned so one hot key or tenant cannot starve unrelated work.
- Recovery capacity SHOULD exceed normal arrival rate enough to drain plausible backlogs within objectives.

## Exceptions
Lossy queues are permitted only when data loss is an explicit contract and downstream correctness is unaffected.

## Verification
Run producer bursts and consumer slowdowns, inspect queue telemetry, test poison messages and duplicates, and measure drain time after restoring capacity.