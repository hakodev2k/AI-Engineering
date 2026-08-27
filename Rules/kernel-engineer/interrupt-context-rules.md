# Interrupt and Execution Context Rules

## Purpose
Keep code correct across interrupt, deferred-work, process, preemptible, and non-preemptible contexts.

## Scope
Interrupt handlers, deferred execution, preemption, CPU-local state, and context-sensitive APIs.

## MUST
- Every context-sensitive path MUST identify whether it may sleep, allocate, block, migrate, or be preempted.
- Interrupt handlers MUST perform only bounded work and defer non-critical processing when practical.
- Data shared between interrupt and non-interrupt contexts MUST use synchronization valid for both contexts.
- Context transitions MUST preserve required ordering and lifetime guarantees.
- Latency-sensitive interrupt paths MUST have measurable budgets or evidence of bounded execution.

## MUST NOT
- MUST NOT invoke sleeping or blocking operations from contexts where they are forbidden.
- MUST NOT rely on CPU-local assumptions across code that may migrate unless migration is explicitly prevented.
- MUST NOT disable interrupts or preemption for unbounded work.

## SHOULD
- Minimize time with interrupts or preemption disabled.
- Deferred work SHOULD be cancelable or drainable during teardown when lifetime requires it.
- Context assumptions SHOULD be asserted where supported.

## Exceptions
Exceptions require timing evidence, context analysis, recovery implications, and maintainer approval.

## Verification
Use context assertions, latency tracing, stress tests, lock/context validators, teardown tests, and review all call chains reachable from restricted contexts.