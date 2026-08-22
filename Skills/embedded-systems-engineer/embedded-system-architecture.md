# Embedded System Architecture

## Purpose
Design maintainable embedded software boundaries across hardware abstraction, drivers, middleware, application logic, and platform services while respecting resource and timing constraints.

## When to use
Use when starting a firmware product, adding a major subsystem, porting hardware, or untangling tightly coupled firmware.

## Inputs
Requirements, MCU/SoC documentation, board schematic, memory map, timing constraints, existing source tree, toolchain, and deployment constraints.

## Preconditions
Confirm target hardware, safety/reliability expectations, real-time needs, and supported build/debug environment.

## Context to inspect
Inspect startup code, linker configuration, interrupt ownership, peripherals, RTOS usage, shared state, persistent storage, boot flow, and hardware-dependent code.

## Core knowledge
Good embedded architecture isolates volatile hardware details from stable domain behavior. Boundaries must account for memory, latency, interrupt context, initialization order, failure recovery, and testability. Abstraction has runtime and flash costs, so introduce it where change or verification value exceeds cost.

## Procedure
1. Identify externally observable responsibilities and critical constraints.
2. Map hardware resources and ownership.
3. Separate board support, HAL/drivers, services, and application policy.
4. Define dependency direction and initialization lifecycle.
5. Define synchronous, asynchronous, and interrupt-driven interactions.
6. Make error propagation and degraded behavior explicit.
7. Identify components that require host-side or hardware-in-loop tests.
8. Review memory, latency, coupling, and portability costs.
9. Document architectural decisions that constrain future work.

## Decision points
Prefer direct access for tiny stable low-level paths; prefer interfaces around replaceable hardware, complex services, and test boundaries. Use an RTOS only when scheduling, isolation, timing, or concurrency needs justify its complexity.

## Common failure patterns
Global mutable state, drivers containing business policy, hidden interrupt dependencies, initialization by accident, excessive abstraction, and hardware assumptions scattered through application code.

## Verification
Build all supported targets, inspect memory usage, execute representative hardware flows, validate startup/recovery paths, and confirm modules can be reasoned about and tested independently.

## Expected output
A documented component model with responsibilities, dependencies, resource ownership, lifecycle, failure behavior, and verification boundaries.

## Stop conditions
Stop when hardware documentation is missing, critical timing requirements are unknown, or architectural changes could affect regulated/safety behavior without required review.