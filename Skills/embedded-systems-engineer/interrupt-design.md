# Interrupt Design

## Purpose
Design interrupt handling that is bounded, race-aware, priority-correct, and compatible with real-time behavior.

## When to use
Use when adding or reviewing ISRs, latency-sensitive peripherals, nested interrupts, deferred processing, or intermittent concurrency faults.

## Inputs
Interrupt table, priority configuration, timing requirements, ISR code, RTOS rules, peripheral documentation, and traces.

## Context to inspect
Inspect interrupt sources, acknowledgement semantics, shared variables, critical sections, priority grouping, masking, nesting, and task wakeups.

## Core knowledge
ISRs execute asynchronously and can preempt ordinary code. Keep work bounded, understand memory visibility and atomicity, clear sources correctly, and defer non-critical work. Priority inversion can exist between interrupts and tasks as well as among tasks.

## Procedure
1. Inventory interrupt sources and maximum expected rates.
2. Define latency and execution budgets.
3. Assign priorities based on deadlines, not convenience.
4. Minimize ISR work and defer processing where possible.
5. Review shared data for atomicity and synchronization.
6. Confirm source acknowledgement/clear ordering.
7. Measure worst-case ISR duration and nesting.
8. Stress simultaneous and bursty sources.
9. Verify no prohibited RTOS/API calls occur in ISR context.

## Decision points
Use ISR-to-task/event handoff for substantial work. Disable interrupts only for the smallest provably bounded critical region. Prefer lock-free single-producer patterns when they simplify ISR handoff safely.

## Common failure patterns
Logging heavily inside ISRs, unbounded loops, wrong priorities, lost events, clearing flags too early/late, non-atomic shared state, and long global interrupt masks.

## Verification
Capture latency and execution timing, stress maximum event rates, verify counters for lost/overrun events, and run race-focused tests.

## Expected output
A documented interrupt model with priorities, budgets, handoff mechanisms, synchronization, and measured timing.

## Stop conditions
Stop when deadline requirements or interrupt priority constraints from the RTOS/platform are unknown.