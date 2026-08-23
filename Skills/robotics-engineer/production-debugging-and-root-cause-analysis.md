# Production Debugging and Root Cause Analysis

## Purpose
Diagnose robot failures systematically across software, timing, sensors, actuators, networks, mechanics, and environment without destroying evidence or introducing unsafe experiments.

## When to use
Use for intermittent faults, field incidents, degraded autonomy, unexpected motion, resets, data corruption, or performance regressions.

## Inputs
Incident description, logs, bag/trace data, metrics, firmware/software versions, hardware identity, environment, operator actions, recent changes.

## Preconditions
System is placed in a safe diagnostic state and evidence is preserved.

## Context to inspect
Timeline, clocks, errors, state transitions, sensor health, actuator faults, CPU/memory/network load, power/thermal data, configuration, calibration, physical damage.

## Core knowledge
Robotics failures often cross layer boundaries. Correlation is not causation; clock alignment, reproducibility, change history, and controlled hypothesis testing are essential.

## Procedure
1. Freeze versions/configuration and preserve raw evidence.
2. Build a single timestamped incident timeline.
3. Separate observed facts from hypotheses.
4. Identify the first abnormal signal, not merely the final failure.
5. Compare against a known-good run or unit.
6. Rank hypotheses by explanatory power and test cost.
7. Reproduce with the least hazardous controlled experiment.
8. Instrument missing evidence rather than guessing.
9. Confirm root cause by removing or inducing the causal condition when safe.
10. Implement correction, regression test, and prevention/monitoring.

## Decision points
Prefer offline replay and bench reproduction before field experimentation. Escalate to hardware specialists when electrical/mechanical evidence dominates.

## Common failure patterns
Restarting before evidence capture, blaming the last logged error, changing multiple variables, ignoring clock skew, tuning around hardware defects, and declaring root cause without falsification.

## Verification
Reproduce the original failure before the fix when feasible, demonstrate non-recurrence after the fix, and test adjacent failure modes.

## Expected output
Incident timeline, evidence-backed root cause, corrective action, regression test, and residual uncertainty.

## Stop conditions
Stop unsafe reproduction, or escalate when evidence requires destructive inspection, production access, or specialist equipment.