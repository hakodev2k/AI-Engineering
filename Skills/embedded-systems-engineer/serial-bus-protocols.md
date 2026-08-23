# Serial Bus Protocols

## Purpose
Design and troubleshoot reliable UART, SPI, I2C, and similar board-level communication under electrical, timing, framing, and concurrency constraints.

## When to use
Use for sensor/device integration, communication failures, throughput issues, bus sharing, or driver reviews.

## Inputs
Device datasheets, schematic, bus topology, clock rates, protocol requirements, captures, and driver code.

## Context to inspect
Inspect electrical levels/pull-ups, chip selects/addresses, modes, timing, framing, buffering, timeout handling, retries, and concurrent bus users.

## Core knowledge
Protocol correctness spans software and electrical behavior. SPI mode/CS timing, I2C pull-ups/arbitration/stretching, and UART baud/framing tolerance matter. Recovery must distinguish transient errors from persistent hardware faults.

## Procedure
1. Confirm electrical compatibility and topology.
2. Derive timing/mode/address configuration from datasheets.
3. Define transaction boundaries and bus ownership.
4. Implement bounded timeouts and explicit errors.
5. Add buffering/interrupt/DMA only as throughput requires.
6. Define recovery for stuck or partial transactions.
7. Capture real traffic with appropriate instrumentation.
8. Stress maximum rate and concurrent clients.

## Decision points
Use polling for low-rate bounded traffic; interrupts/DMA for sustained or latency-sensitive traffic. Retry only errors likely to be transient and cap attempts.

## Common failure patterns
Wrong SPI mode, missing I2C pull-up assumptions, infinite waits, stale receive bytes, uncontrolled retries, CS timing violations, and blaming firmware without observing the bus.

## Verification
Compare captures against protocol/device timing, inject NACK/timeouts/framing errors where feasible, and verify recovery without reboot.

## Expected output
A reliable bus integration with documented timing, ownership, timeout/recovery behavior, and captured evidence.

## Stop conditions
Stop when electrical design, device timing, or bus ownership cannot be established.