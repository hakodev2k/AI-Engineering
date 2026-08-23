# Peripheral Driver Design

## Purpose
Implement robust, reusable drivers for MCU peripherals and external devices with explicit state, timing, ownership, and error behavior.

## When to use
Use for GPIO, timers, ADC/DAC, PWM, watchdogs, sensors, storage, communication controllers, and board-specific devices.

## Inputs
Datasheets, reference manuals, errata, schematic, electrical constraints, timing requirements, existing HAL, and test hardware.

## Context to inspect
Inspect clock/reset dependencies, pin muxing, register access, interrupts, DMA, power states, bus ownership, and existing driver conventions.

## Core knowledge
Drivers translate hardware contracts into software contracts. Correctness depends on register sequencing, volatile access, timing, concurrency, reset state, electrical behavior, and documented errata.

## Procedure
1. Define the driver's public behavior and ownership model.
2. Identify initialization and shutdown sequences.
3. Map required registers, clocks, pins, interrupts, and DMA channels.
4. Encode states and invalid transitions explicitly.
5. Separate configuration from runtime operations.
6. Define timeout and hardware error handling.
7. Protect shared access across tasks and interrupts.
8. Add diagnostics without disturbing critical timing.
9. Test normal, boundary, timeout, reset, and fault paths.

## Decision points
Choose polling for bounded simple operations, interrupts for asynchronous events, and DMA for sustained transfers where CPU savings justify complexity. Wrap vendor HALs when portability/testability value is real.

## Common failure patterns
Magic delays, undocumented register writes, infinite waits, ignoring errata, clearing status flags incorrectly, unsafe reentrancy, and assuming peripheral reset state.

## Verification
Validate signals with appropriate instruments when necessary, exercise errors and timeouts, compare configuration against datasheets, and run repeated reset/reinitialization tests.

## Expected output
A deterministic driver with documented API, state transitions, resource ownership, timing assumptions, errors, and tests.

## Stop conditions
Stop when electrical limits, pin assignments, clock configuration, or silicon revision/errata are unresolved.