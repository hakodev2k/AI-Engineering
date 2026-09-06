# Concurrency and Stream Rules

## Purpose
Use asynchronous GPU execution safely and avoid hidden serialization.

## Scope
Streams, events, dependencies, host callbacks, asynchronous launches, and concurrent workloads.

## MUST
- Cross-stream dependencies MUST be explicit and validated.
- Asynchronous resource lifetimes MUST extend until dependent work completes.
- Synchronization points in hot paths MUST be measured and justified.
- Concurrent workload tests MUST cover realistic contention and ordering.

## MUST NOT
- MUST NOT rely on accidental default-stream ordering for correctness.
- MUST NOT insert global synchronization merely to mask dependency bugs.
- MUST NOT reuse buffers while asynchronous consumers may still access them.

## SHOULD
- SHOULD overlap independent compute and transfer work when measurements show benefit.
- SHOULD use the narrowest synchronization primitive that preserves correctness.

## Exceptions
Exceptions require a documented ordering model, evidence, and reviewer approval.

## Verification
Inspect traces, race/synchronization tests, stream dependency code, and concurrent load benchmarks.