# Interrupt and Concurrency Design

## Purpose
Design safe, bounded interaction between interrupt context, tasks and foreground code.

## When to use
Use for event-driven firmware, race investigations, latency work or shared-state review.

## Inputs
Execution model, interrupt priorities, shared state, timing requirements and scheduler configuration.

## Context to inspect
Handlers, critical sections, atomics, queues, locks, priority relationships and blocking operations.

## Core knowledge
Interrupt context must remain bounded. Atomicity is platform-dependent; volatile does not provide synchronization. Priority inversion and lock ordering matter under an RTOS.

## Procedure
1. Enumerate execution contexts and priorities.
2. Identify shared mutable state.
3. Define ownership and synchronization.
4. Move noncritical work out of handlers.
5. Bound critical sections.
6. Define event handoff and overflow behavior.
7. Analyze worst-case latency.
8. Stress concurrent paths.

## Decision points
Prefer message passing or single ownership when practical; use atomics or critical sections only with understood memory and latency semantics.

## Common failure patterns
Long handlers, blocking in interrupt context, missed events, torn updates, priority inversion, unbounded queues and treating volatile as a lock.

## Verification
Use stress tests, timing traces, race-oriented tests and queue-overflow scenarios.

## Expected output
A concurrency model with explicit ownership and measured latency bounds.

## Stop conditions
Escalate when timing guarantees or scheduler semantics are unknown and correctness depends on them.