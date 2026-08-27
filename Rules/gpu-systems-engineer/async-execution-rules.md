# Asynchronous Execution Rules

## Purpose
Make streams, queues, events, callbacks, and host-device concurrency correct and diagnosable.

## Scope
All asynchronous GPU execution and dependency management.

## MUST
- Data dependencies MUST be represented by explicit ordering or synchronization primitives.
- Host-visible results MUST be synchronized before consumption unless an equivalent dependency guarantee exists.
- Stream/queue ownership and concurrency assumptions MUST be documented at shared boundaries.
- Asynchronous errors MUST be surfaced at a deterministic observation point.

## MUST NOT
- MUST NOT use global synchronization as a default substitute for dependency reasoning.
- MUST NOT assume operations issued on different streams are ordered without a documented guarantee.
- MUST NOT allow host buffers to expire while asynchronous transfers reference them.

## SHOULD
- Use fine-grained events/dependencies where they improve overlap without obscuring correctness.
- Keep synchronization boundaries visible in profiling traces.

## Exceptions
Additional synchronization may be accepted for safety or simplicity when latency impact is measured and documented.

## Verification
Review dependency graphs, run race tools, inspect timelines, execute concurrency stress tests, and verify asynchronous error propagation.