# Peripheral Driver Design

## Purpose
Build reusable peripheral drivers with clear state, timing and error contracts.

## When to use
Use for platform peripherals, external devices or driver refactoring.

## Inputs
Device documentation, platform API, interface timing, required modes and error behavior.

## Context to inspect
Existing HAL, initialization, ownership, bus sharing, callbacks, timeout policy and tests.

## Core knowledge
Drivers should separate transport from device policy, model state explicitly and surface recoverable failures without leaking unnecessary platform details.

## Procedure
1. Define supported operations and states.
2. Separate transport and device behavior.
3. Specify initialization and shutdown.
4. Define timeout and error semantics.
5. Handle asynchronous completion explicitly.
6. Bound buffers and retries.
7. Add test seams around transport.
8. Validate normal, boundary and recovery paths.

## Decision points
Choose blocking APIs for simple bounded operations; choose asynchronous APIs when latency or concurrency requires them.

## Common failure patterns
Implicit state, infinite waits, retry storms, shared-bus races, hidden allocation, ignored device status and platform coupling.

## Verification
Run unit tests with transport fakes plus target integration tests and timing measurements.

## Expected output
A cohesive driver with documented lifecycle and failure behavior.

## Stop conditions
Escalate when device timing or electrical assumptions are missing and implementation correctness depends on them.