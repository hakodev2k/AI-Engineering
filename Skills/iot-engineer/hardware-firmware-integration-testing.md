# Hardware-Firmware Integration Testing

## Purpose
Verify firmware against real electrical, timing, peripheral, power, and environmental behavior.

## When to use
Use for new boards, component substitutions, driver changes, and release qualification.

## Inputs
Schematics, datasheets, firmware, test points, hardware revisions, expected behaviors.

## Context to inspect
Drivers, buses, interrupts, DMA, power rails, clocks, pin configuration, manufacturing variants.

## Core knowledge
Mocks cannot reproduce signal integrity, timing races, brownouts, component tolerances, or silicon errata. Senior validation combines automated hardware-in-loop tests with targeted instrumentation.

## Procedure
1. Map firmware assumptions to hardware interfaces.
2. Define tests for nominal and boundary electrical conditions.
3. Exercise boot, reset, peripheral initialization, and communication.
4. Test timing, concurrency, and interrupt-heavy scenarios.
5. Inject disconnects, malformed signals, and power interruptions.
6. Test supported hardware revisions/components.
7. Capture traces for failures.
8. Add stable scenarios to hardware-in-loop regression.

## Decision points
Use simulation for fast logic coverage and real hardware for electrical/timing evidence; neither replaces the other.

## Common failure patterns
Testing one board, ignoring tolerance ranges, flaky benches without instrumentation, and treating driver success as end-to-end correctness.

## Verification
Repeat tests across representative units, revisions, temperatures, power states, and stress conditions.

## Expected output
Reproducible hardware-in-loop evidence and documented compatibility.

## Stop conditions
Stop release when failures suggest hardware damage or unsafe actuator behavior.