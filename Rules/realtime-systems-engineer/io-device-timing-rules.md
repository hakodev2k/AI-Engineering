# I/O and Device Timing Rules

## Purpose
Control latency and failure behavior at hardware and device boundaries.

## Scope
Drivers, buses, DMA, device commands, sensors, actuators, and peripheral transactions.

## MUST
- Device operations used by real-time paths MUST have documented worst-case completion, timeout, and retry behavior.
- Bus arbitration, DMA contention, and driver serialization MUST be included in timing analysis when material.
- Critical I/O MUST define stale-data, missing-data, and partial-transfer behavior.
- Actuation paths MUST fail to a defined safe or degraded state when deadlines are missed.

## MUST NOT
- MUST NOT block indefinitely on device readiness or external acknowledgements.
- MUST NOT assume nominal device datasheet timing is a system-level worst-case bound without validation.

## SHOULD
- Prefer asynchronous or bounded polling designs that make I/O latency observable and controllable.

## Exceptions
Exceptions require measured platform evidence, bounded failure handling, and review.

## Verification
Inspect driver code, hardware traces, timeout configuration, bus-load tests, fault injection, and end-to-end latency measurements.