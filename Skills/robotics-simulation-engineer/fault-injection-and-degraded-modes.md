# Fault Injection and Degraded Modes

## Purpose
Inject realistic component, communication, sensing, actuation, and environmental faults to validate robot detection, containment, fallback, and recovery behavior.

## When to use
Use for reliability qualification, safety analysis, incident reproduction, watchdog validation, degraded autonomy, and recovery testing.

## Inputs
Failure taxonomy, FMEA/hazard analysis, field incidents, subsystem interfaces, expected fallback behavior, timing requirements, safety constraints.

## Preconditions
Normal operation and expected fault response must be specified before fault injection.

## Context to inspect
Sensor dropouts/bias, actuator saturation/stuck states, packet loss/delay, compute overload, stale transforms, clock jumps, localization loss, corrupted data, power-limited behavior, environmental obstruction, and reset paths.

## Core knowledge
Faults have onset, duration, magnitude, correlation, and recovery semantics. Unrealistic instantaneous faults can miss dangerous transient behavior. Injection should occur at the boundary where the real failure manifests, not wherever implementation is easiest.

## Procedure
1. Trace faults to hazards, requirements, and field evidence.
2. Define manifestation, onset profile, duration, and recovery.
3. Select an injection boundary that preserves production interfaces.
4. Establish expected detection time and system response.
5. Run one fault at a time for diagnosability.
6. Add correlated/multiple faults only where credible.
7. Capture state before, during, and after injection.
8. Verify alarms, fallback, containment, and recovery.
9. Test boundary magnitudes and intermittent behavior.
10. Promote stable high-value fault cases into regression suites.

## Decision points
Prefer interface-level injection for system behavior; use lower-level physics faults when mechanical effects matter. Test both fail-silent and plausible-but-wrong data where relevant.

## Common failure patterns
Injecting impossible faults; bypassing production detection paths; testing only permanent failures; no recovery phase; fault timing not recorded; declaring success because the robot stopped without validating safe state.

## Verification
Verify fault manifestation matches the intended failure, detection occurs within limits, fallback state is correct, unsafe commands are contained, recovery is controlled, and artifacts allow replay.

## Expected output
A traceable fault campaign with injection specifications, expected responses, measured detection/recovery results, and residual risks.

## Stop conditions
Stop when an injected condition could affect real hardware unexpectedly, safety response is undefined, or a failure exposes a hazard requiring engineering approval before further testing.