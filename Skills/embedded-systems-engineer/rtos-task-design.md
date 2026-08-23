# RTOS Task Design

## Purpose
Design RTOS tasks, priorities, queues, timers, and synchronization so concurrency remains deterministic, diagnosable, and resource-efficient.

## When to use
Use when introducing an RTOS, adding concurrent subsystems, diagnosing scheduling problems, or restructuring task ownership.

## Inputs
Task requirements, deadlines, event rates, RTOS configuration, stack limits, shared resources, and traces.

## Context to inspect
Inspect task creation, priorities, blocking calls, queues, mutexes, semaphores, timers, ISR handoffs, stack allocation, and watchdog behavior.

## Core knowledge
Tasks should represent independently schedulable responsibilities, not arbitrary modules. Blocking is often preferable to polling. Priority selection must reflect deadlines and blocking dependencies. Synchronization must account for priority inversion and bounded waiting.

## Procedure
1. Identify concurrent responsibilities and deadlines.
2. Define task ownership of mutable resources.
3. Choose event-driven blocking interfaces.
4. Assign priorities from timing requirements.
5. Select queues/events/mutexes based on communication semantics.
6. Analyze blocking chains and priority inversion.
7. Size stacks from measurement plus justified margin.
8. Define watchdog/health expectations per critical task.
9. Stress peak workloads and fault conditions.

## Decision points
Prefer fewer cohesive tasks over one task per component. Use queues for ownership transfer/data flow, notifications/events for lightweight signaling, and mutexes for genuinely shared resources.

## Common failure patterns
Busy loops, priority chosen by perceived importance, oversized stacks everywhere, mutex use in ISR context, unbounded queue growth, hidden shared state, and holding locks across slow I/O.

## Verification
Measure task runtime, ready/block times, stack high-water marks, queue occupancy, missed deadlines, and behavior under overload.

## Expected output
A task model with responsibilities, priorities, communication, synchronization, stack budgets, and overload behavior.

## Stop conditions
Stop when deadlines, RTOS API context rules, or memory budgets are unknown.