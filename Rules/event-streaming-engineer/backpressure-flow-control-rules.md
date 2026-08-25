# Backpressure and Flow Control Rules

## Purpose
Prevent fast producers or slow dependencies from turning normal load variation into cascading failure.

## Scope
Applies to producer buffering, consumer fetch, processing concurrency, sink capacity, queues, and admission controls.

## MUST
- Every high-throughput pipeline MUST define what happens when downstream processing is slower than ingress.
- Buffer sizes, batch sizes, concurrency, and in-flight limits MUST be bounded by memory and downstream capacity.
- Consumer throughput and lag growth MUST be monitored together.
- Overload controls MUST prefer bounded degradation over unbounded memory growth or connection exhaustion.
- Recovery from backlog MUST be capacity-tested so catch-up traffic does not re-overload dependencies.

## MUST NOT
- MUST NOT use unbounded application queues for sustained stream buffering.
- MUST NOT increase concurrency as a default response to lag without measuring bottlenecks.
- MUST NOT hide backpressure by dropping events unless loss is an explicit contract.

## SHOULD
- Producers SHOULD expose blocking, throttling, or explicit rejection behavior when buffers saturate.
- Consumers SHOULD use adaptive or capacity-aware concurrency where stable and testable.
- Capacity models SHOULD include peak ingress and backlog recovery.

## Exceptions
Intentional dropping or sampling requires a documented loss contract, selection policy, metrics, and stakeholder approval.

## Verification
Use load and soak tests, memory profiles, downstream saturation tests, lag recovery measurements, and configuration inspection.