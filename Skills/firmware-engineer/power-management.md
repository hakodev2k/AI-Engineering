# Power Management

## Purpose
Reduce firmware-driven energy consumption without compromising responsiveness or correctness.

## When to use
Use for battery products, thermal constraints, sleep-state integration or unexplained current draw.

## Inputs
Power targets, operating modes, wake sources, clock/peripheral needs and measured current.

## Context to inspect
Idle behavior, timers, polling, peripheral states, clock configuration, wake paths and retained state.

## Core knowledge
Energy is workload over time. Sleep depth trades wake latency and retained context against power savings.

## Procedure
1. Establish measured baseline by operating mode.
2. Identify unnecessary wakeups and active peripherals.
3. Define system power states.
4. Specify entry, retention and wake contracts.
5. Coordinate tasks and peripherals before sleep.
6. Validate wake reasons and restored state.
7. Measure current and latency across scenarios.

## Decision points
Choose the deepest state that satisfies wake latency, retention and peripheral requirements; avoid complexity with negligible measured benefit.

## Common failure patterns
Polling, forgotten peripherals, wake storms, lost state, race during sleep entry and optimizing estimated rather than measured consumption.

## Verification
Measure energy across representative duty cycles and test every supported wake source repeatedly.

## Expected output
A documented power-state model with measured savings and latency.

## Stop conditions
Escalate when board-level current contributors cannot be isolated from firmware behavior.