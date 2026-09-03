# Timing Synchronization and Real-Time Factor

## Purpose
Design and validate simulation time so controllers, sensors, middleware, and physics advance coherently under accelerated, real-time, paused, or stepped execution.

## When to use
Use when integrating robot software, debugging nondeterministic timing failures, running hardware/software-in-the-loop, or scaling simulation faster than real time.

## Inputs
Control frequencies, sensor rates, simulator clock semantics, middleware configuration, deadlines, recorded timing traces.

## Preconditions
All components must have defined clock and timestamp expectations.

## Context to inspect
Physics timestep, substeps, callback ordering, sensor publication, transport queues, wall time versus simulation time, timeouts, timers, watchdogs, and CPU/GPU saturation.

## Core knowledge
Correct simulation time is not equivalent to fast execution. Components that accidentally use wall time can break under pause or acceleration. Real-time factor, jitter, causality, and event ordering must be observable.

## Procedure
1. Inventory all clocks and timer sources.
2. Define authoritative simulation time and stepping policy.
3. Map each control and sensor rate to physics steps.
4. Identify components that depend on wall time.
5. Define ordering for physics, actuation, sensing, and middleware publication.
6. Instrument timestep, jitter, queue delay, and real-time factor.
7. Test real-time, faster-than-real-time, paused, and single-step modes.
8. Stress compute until deadline misses appear.
9. Confirm timeouts and watchdogs behave intentionally.
10. Document supported timing modes.

## Decision points
Use lockstep for deterministic closed-loop testing; use asynchronous execution when production concurrency itself is under test. Reduce fidelity or parallelism before allowing silent timestep drift.

## Common failure patterns
Mixing wall and simulation time; sensors sampled after future state; hidden message queues; control rates not integer-compatible with stepping; assuming real-time factor of one guarantees low jitter.

## Verification
Verify monotonic timestamps, causal ordering, expected sample counts, bounded jitter, reproducible stepping, and correct timeout behavior under load.

## Expected output
A timing contract, instrumentation results, supported execution modes, and identified timing risks.

## Stop conditions
Stop when third-party components cannot consume simulation time correctly or timing ambiguity prevents causal interpretation of results.