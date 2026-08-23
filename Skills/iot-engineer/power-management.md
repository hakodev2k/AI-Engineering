# Power Management

## Purpose
Engineer device behavior to meet battery life and thermal goals without sacrificing required reliability.

## When to use
Use for battery-powered devices, thermal constraints, unexpected field lifetime, or connectivity optimization.

## Inputs
Battery characteristics, duty cycle, radio behavior, sensors, compute workload, environmental range.

## Context to inspect
Sleep states, wake sources, peripheral leakage, transmit intervals, retry behavior, regulators, and measured current traces.

## Core knowledge
Average current alone can hide peak-current failures. Battery chemistry, temperature, self-discharge, regulator efficiency, radio retries, and sleep leakage materially affect lifetime.

## Procedure
1. Build an energy budget by operating state.
2. Measure current traces on representative hardware.
3. Minimize active time and unnecessary wakeups.
4. Select appropriate MCU/radio sleep states.
5. Batch network and sensor work where latency permits.
6. Bound reconnect and retry energy.
7. Model battery behavior across temperature and aging.
8. Validate low-voltage and brownout recovery.

## Decision points
Trade reporting frequency and local processing against radio cost using measurements. Prefer event-driven wakeups when polling adds no value.

## Common failure patterns
Datasheet-only estimates, peripherals left powered, retry loops, flash writes on every sample, and ignoring cold-temperature capacity.

## Verification
Measure sleep, active, transmit, fault, and low-battery states and compare projected lifetime with field targets.

## Expected output
A measured energy budget and validated power strategy.

## Stop conditions
Escalate when hardware leakage or battery limitations make requirements physically unattainable.