# RTOS Architecture

## Purpose
Select and structure RTOS facilities so task execution, synchronization, timing, and fault handling remain analyzable and maintainable.

## When to use
Use when designing a new real-time platform, migrating RTOSes, adding critical tasks, or reviewing scheduler/kernel dependencies.

## Inputs
Timing requirements, hardware, task model, memory limits, safety/security constraints, driver needs, certification requirements.

## Context to inspect
Kernel configuration, scheduler modes, tick/tickless behavior, timers, synchronization primitives, memory allocators, privilege model, drivers, and BSP.

## Core knowledge
RTOS choice affects preemption behavior, interrupt latency, timer resolution, memory determinism, isolation, tooling, ecosystem maturity, and assurance evidence. Kernel features should be enabled intentionally.

## Procedure
1. Translate system requirements into kernel capabilities.
2. Inventory tasks, interrupts, timers, IPC, and memory needs.
3. Validate scheduler and priority semantics.
4. Decide tick, tickless, and timer-resolution strategy.
5. Define task boundaries and ownership.
6. Restrict dynamic kernel objects on critical paths where needed.
7. Configure stack sizing and overflow detection.
8. Define fault, restart, and watchdog behavior.
9. Validate BSP/driver timing behavior.
10. Document kernel assumptions and upgrade constraints.

## Decision points
Choose the smallest feature set that meets assurance and operational needs. Prefer platform-native primitives when their semantics are well understood; abstractions are valuable only if they preserve timing behavior.

## Common failure patterns
Default kernel configuration, excessive tasks, hidden dynamic allocation, incorrect priority ranges, timer-resolution assumptions, and unsafe dependencies on non-real-time middleware.

## Verification
Run scheduler traces, stack watermark checks, deadline tests, overload tests, and reboot/fault scenarios on target hardware.

## Expected output
An RTOS architecture with configuration rationale, task/kernel boundaries, timing assumptions, and verification evidence.

## Stop conditions
Stop if kernel guarantees, licensing/certification constraints, or BSP behavior cannot support required assurance.