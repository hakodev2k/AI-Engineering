# Concurrency and Interrupt Rules

## Purpose
Prevent races, deadlocks, priority inversion, and unsafe ISR/task interaction.

## Scope
ISRs, RTOS tasks, atomics, shared state, locks, queues, and DMA completion.

## MUST
- Document synchronization and ownership for state shared across execution contexts.
- Keep ISR work bounded and defer non-critical work when possible.
- Protect multi-step shared-state invariants with mechanisms valid for the target architecture.

## MUST NOT
- Use `volatile` as a substitute for synchronization or atomicity.
- Call blocking or non-ISR-safe APIs from interrupt context.

## SHOULD
- Prefer message passing or single-owner state where it reduces shared mutable state.

## Exceptions
Lock-free designs require explicit memory-order reasoning and evidence.

## Verification
Use static analysis, stress tests, race-oriented tests, scheduler traces, and code review of every shared-state boundary.