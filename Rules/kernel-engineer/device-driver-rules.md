# Device Driver Rules

## Purpose
Ensure drivers interact safely with hardware, kernel subsystems, power states, and device lifecycles.

## Scope
Probe, initialization, I/O, interrupts, DMA, suspend/resume, hotplug, reset, and removal.

## MUST
- Driver initialization MUST unwind every acquired resource correctly on partial failure.
- Hardware inputs and status values MUST be treated as untrusted and validated before affecting memory or control flow.
- Removal and shutdown MUST quiesce asynchronous work before releasing reachable resources.
- DMA operations MUST obey mapping, ownership, coherency, boundary, and device-addressability constraints.
- Reset, timeout, and device-loss behavior MUST be defined for production-relevant devices.
- Power-management transitions MUST preserve device and software state invariants.

## MUST NOT
- MUST NOT access registers, memory, or queues after device teardown makes them invalid.
- MUST NOT trust firmware/device lengths or indices without bounds checks.
- MUST NOT busy-wait indefinitely for hardware state.

## SHOULD
- Prefer subsystem abstractions over device-specific duplication.
- Recovery paths SHOULD be idempotent where repeated faults are possible.
- Driver logs SHOULD identify actionable hardware state without leaking sensitive data.

## Exceptions
Hardware-specific deviations require documented device constraints, evidence, alternatives, and maintainer approval.

## Verification
Exercise probe failure, hotplug, suspend/resume, reset, timeout, DMA stress, malformed device responses, and teardown under load; use sanitizers and subsystem diagnostics where available.