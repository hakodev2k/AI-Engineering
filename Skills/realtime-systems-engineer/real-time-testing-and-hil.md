# Real-Time Testing and HIL

## Purpose
Verify functional correctness and timing guarantees under realistic hardware, timing, fault, and workload conditions, including hardware-in-the-loop where appropriate.

## When to use
Use for control systems, embedded devices, device drivers, timing-sensitive releases, regression protection, and safety/reliability validation.

## Inputs
Requirements, timing budgets, target hardware, simulators, test harnesses, I/O models, fault scenarios, acceptance criteria.

## Context to inspect
Unit/integration tests, simulators, HIL rigs, clocks, signal generators, workload generators, instrumentation, CI environment, and hardware revisions.

## Core knowledge
Functional tests can pass while deadlines fail. Real-time verification needs deterministic stimulus, timestamped observation, boundary/load tests, long-duration runs, and fault injection. Simulation is valuable but cannot fully replace target-hardware evidence for hardware-dependent timing.

## Procedure
1. Trace timing and functional requirements to tests.
2. Separate logic tests from platform timing tests.
3. Build deterministic stimulus and timestamped capture.
4. Test min/nominal/max rates and boundary timing.
5. Exercise burst, overload, clock drift, and resource contention.
6. Inject I/O, network, sensor, and dependency faults.
7. Use HIL for actuator/sensor timing and closed-loop behavior where relevant.
8. Repeat long-duration and thermal/power-state scenarios.
9. Store timing distributions and maxima as regression evidence.
10. Gate releases on explicit deadline criteria.

## Decision points
Use simulation for fast broad coverage; use HIL when physical interfaces and timing materially affect behavior; use on-target system tests for final timing claims.

## Common failure patterns
Testing only nominal load, nondeterministic test clocks, comparing timing across different hardware, flaky thresholds without measurement uncertainty, and declaring success from unit tests alone.

## Verification
Confirm each critical requirement has reproducible evidence on the appropriate test level and target configuration.

## Expected output
A layered test strategy, deterministic harness, HIL/on-target evidence, and timing regression gates.

## Stop conditions
Stop when test hardware or instrumentation cannot represent the critical timing path closely enough to support the claimed assurance.