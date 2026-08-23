# Power Management

## Purpose
Reduce energy consumption without breaking timing, communication, state retention, or wakeup reliability.

## When to use
Use for battery products, thermal limits, low-power modes, runtime optimization, or unexpected current draw.

## Inputs
Power budget, MCU power modes, peripheral requirements, wake sources, clock tree, measurements, and usage profiles.

## Context to inspect
Inspect clocks, regulators, GPIO states, peripheral enablement, sleep entry/exit, wake interrupts, retained state, radios, polling loops, and background timers.

## Core knowledge
Energy is power integrated over time. Deep sleep saves more current but increases wake latency and state-management complexity. Peripheral and board leakage may dominate MCU current. Optimize measured system energy, not datasheet CPU current alone.

## Procedure
1. Define representative usage states and energy budget.
2. Measure baseline current per state.
3. Attribute major consumers.
4. Eliminate unnecessary wakeups and polling.
5. Gate clocks/peripherals safely.
6. Select sleep depth from latency and retention requirements.
7. Define deterministic sleep entry and wake restoration.
8. Validate communication and timer behavior across sleep.
9. Re-measure complete duty-cycle energy.

## Decision points
Choose deeper sleep when saved energy exceeds wake overhead and latency is acceptable. Batch work to reduce wakeups when freshness permits.

## Common failure patterns
Floating GPIOs, peripherals left enabled, tick timers preventing sleep, wake races, lost state, optimizing firmware while external hardware dominates, and measuring with debug probes that alter power.

## Verification
Measure current with suitable instrumentation, test all wake sources repeatedly, validate long-duration duty cycles, and compare energy against budget.

## Expected output
A power-state design with measured consumption, wake latency, retention behavior, and energy margin.

## Stop conditions
Stop when board-level power paths, wake requirements, or measurement accuracy are unknown.