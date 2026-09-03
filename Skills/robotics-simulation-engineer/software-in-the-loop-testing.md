# Software-in-the-Loop Testing

## Purpose
Integrate production robotics software with simulated sensors, actuators, and environments so behavior can be tested before hardware execution without creating simulation-only code paths.

## When to use
Use for controller, perception, planning, autonomy, middleware, and release regression testing where real hardware is expensive, scarce, slow, or unsafe.

## Inputs
Production binaries/source, interfaces, robot model, simulator adapters, configuration, scenarios, expected behavior and timing requirements.

## Preconditions
Production interfaces and simulation substitutions must be explicit and versioned.

## Context to inspect
Message/API contracts, clocks, configuration injection, device drivers, transforms, middleware QoS, lifecycle/startup ordering, watchdogs, failure handling, and external dependencies.

## Core knowledge
High-value SIL executes as much production code as possible. Simulation-specific branches create false confidence. Adapters should replace physical I/O at well-defined boundaries while preserving protocol, timing, errors, and lifecycle semantics.

## Procedure
1. Map production hardware boundaries and interfaces.
2. Choose substitution points that minimize code divergence.
3. Connect simulator outputs to production sensor contracts.
4. Map production actuator commands into simulator inputs.
5. Route simulation time consistently.
6. Reproduce startup, reset, shutdown, and fault behavior.
7. Validate transforms, units, message schemas, and QoS.
8. Run nominal and failure scenarios using production configurations.
9. Compare SIL traces against hardware runs for equivalent cases.
10. Add stable cases to CI with recorded artifacts.

## Decision points
Mock internal components only for focused unit tests; prefer full production component graphs for system-level SIL. Use recorded services when external systems are nondeterministic or costly, but preserve contract realism.

## Common failure patterns
Simulation-only controller parameters; bypassed safety logic; perfect sensor delivery; different startup sequence; wall-time assumptions; adapters silently changing units or frames.

## Verification
Confirm production binaries/configurations execute unchanged except documented I/O substitution, interfaces match hardware contracts, timing is valid, and selected SIL outcomes correlate with physical tests.

## Expected output
A reproducible SIL harness with interface map, scenario suite, artifacts, known substitutions, and parity evidence.

## Stop conditions
Escalate when production software cannot be isolated from hardware safely, interface semantics are undocumented, or SIL differences invalidate target conclusions.