# Interrupt and ISR Design

## Purpose
Design interrupt handling that responds quickly without monopolizing CPU time or introducing unbounded latency into higher-criticality work.

## When to use
Use for device drivers, sensor input, timers, DMA completion, hardware faults, or unexplained interrupt-driven jitter.

## Inputs
Interrupt sources, rates, priorities, device semantics, ISR code, deferred-work mechanisms, timing requirements.

## Context to inspect
Vector table, masking rules, nesting, shared IRQs, driver code, DMA, cache effects, kernel interrupt threads, and interrupt affinity.

## Core knowledge
ISRs should normally acknowledge hardware, capture minimal state, and defer non-critical work. Interrupt latency includes masking, higher-priority handlers, architectural entry/exit cost, and cache/memory effects.

## Procedure
1. Inventory interrupt sources, maximum rates, and criticality.
2. Set priority from timing consequence, not convenience.
3. Minimize ISR work and prohibit unbounded operations.
4. Use DMA or deferred processing where appropriate.
5. Define safe communication from ISR to task context.
6. Bound interrupt masking and non-preemptible sections.
7. Handle storm, shared-line, and spurious-interrupt cases.
8. Measure entry latency, service time, and downstream completion.
9. Test nested interrupts and overload.

## Decision points
Process in ISR only when immediate hardware response is required; otherwise defer to a schedulable context with explicit priority and budget.

## Common failure patterns
Logging, allocation, blocking, or lengthy loops in an ISR; incorrect acknowledgment ordering; excessive interrupt rate; and priority assignments that starve critical tasks.

## Verification
Measure maximum observed interrupt latency and service time under worst-case load, verify no lost events, and confirm downstream deadlines.

## Expected output
An interrupt design with priorities, bounded ISR behavior, handoff strategy, and timing evidence.

## Stop conditions
Stop when device documentation or interrupt semantics are insufficient to guarantee safe acknowledgment and ordering.