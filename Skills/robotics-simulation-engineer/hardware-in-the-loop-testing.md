# Hardware-in-the-Loop Testing

## Purpose
Connect real controllers, compute units, networks, or embedded devices to simulated robot dynamics and sensors to validate interfaces, timing, and failure behavior before full-system deployment.

## When to use
Use for embedded control validation, ECU/drive integration, network timing, firmware qualification, and faults that software-only simulation cannot reproduce credibly.

## Inputs
Hardware interfaces, electrical/protocol specifications, simulator I/O adapters, timing requirements, safety limits, scenarios, production firmware.

## Preconditions
Bench safety, isolation, emergency-stop behavior, power limits, and ownership of physical interfaces must be established.

## Context to inspect
Signal levels, buses, packet formats, sample rates, clock synchronization, latency, watchdogs, startup sequencing, actuator command limits, and failure injection boundaries.

## Core knowledge
HIL adds real timing and interface behavior but also creates physical risk and new artifacts. The simulation must close the loop at deterministic enough rates, while adapters preserve production semantics and prevent unsafe outputs.

## Procedure
1. Define which hardware components remain real and which are simulated.
2. Map every physical and logical interface.
3. Establish electrical and software safety interlocks.
4. Synchronize simulator and hardware clocks or define measured offsets.
5. Characterize end-to-end I/O latency and jitter.
6. Validate signal scaling, units, checksums, and protocol states.
7. Run low-energy canonical tests before aggressive cases.
8. Exercise startup, reset, communication loss, watchdog, and fault recovery.
9. Capture synchronized hardware and simulator traces.
10. Compare with SIL and physical robot behavior where possible.

## Decision points
Use HIL only where real hardware behavior materially affects conclusions. Prefer SIL for high-volume deterministic tests; reserve HIL for interfaces, timing, firmware, and hardware-dependent protections.

## Common failure patterns
Unsafe actuator outputs; hidden adapter filtering; unsynchronized clocks; test-only firmware; bypassed watchdogs; simulator unable to maintain deadlines; bench behavior mistaken for full-robot validation.

## Verification
Verify protocol correctness, latency/jitter bounds, safety interlocks, watchdog behavior, fault recovery, and trace consistency across repeated runs.

## Expected output
A controlled HIL test setup with interface contract, safety controls, timing evidence, scenario suite, and captured results.

## Stop conditions
Stop immediately on unsafe output, loss of isolation, unexplained timing overruns, hardware damage risk, or any condition requiring unauthorized physical access.