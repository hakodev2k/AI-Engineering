# Production Robot Debugging

## Purpose
Investigate field failures methodically across software, middleware, timing, hardware, environment, configuration, and operator interactions without destroying evidence.

## When to use
Use for mission failures, intermittent crashes, unexplained stops, localization loss, sensor anomalies, or inconsistent fleet behavior.

## Inputs
- Incident timeline
- Logs, metrics, traces, and recordings
- Robot/software/configuration versions
- Hardware health data
- Environmental context
- Reproduction information

## Preconditions
Preserve incident evidence before rebooting, updating, or changing configuration when safety permits.

## Context to inspect
Inspect system logs, ROS graph/events, watchdogs, process exits, sensor health, bus errors, kernel logs, resource pressure, temperatures, configuration drift, and recent deployments.

## Core knowledge
Senior debugging requires hypothesis-driven diagnosis, correlation across clocks and subsystems, distinguishing symptom from cause, safe reproduction, fault-tree reasoning, and evidence preservation.

## Procedure
1. Define the observed failure and mission impact precisely.
2. Build a timeline using synchronized evidence.
3. Record exact software, firmware, hardware, map, model, and configuration versions.
4. Identify the earliest abnormal signal, not just the final error.
5. Partition hypotheses across hardware, environment, timing, middleware, and application logic.
6. Compare with healthy robots/runs when available.
7. Reproduce with recorded data or simulation before using physical hardware.
8. Add targeted instrumentation only where evidence is insufficient.
9. Test the smallest plausible fix against the original failure case.
10. Add a regression test or operational detector.
11. Document root cause, contributing factors, and containment.

## Decision points
Prefer evidence-preserving restart or isolation over destructive reset. Roll back recent changes when correlation is strong and safety/availability demands rapid containment, but continue root-cause analysis afterward.

## Common failure patterns
- Rebooting before collecting evidence
- Assuming the last logged error is the cause
- Changing multiple variables during reproduction
- Ignoring firmware/configuration drift
- Treating an unreproduced fix as verified

## Verification
Replay or recreate the failure, demonstrate that the fix changes the causal behavior, run regression suites, and monitor the field signal that originally detected the incident.

## Expected output
A causal incident analysis with evidence, verified fix or containment, regression protection, and follow-up actions.

## Stop conditions
Stop if further reproduction could damage hardware or endanger people, production access exceeds authorization, evidence points to certified safety hardware, or the incident requires vendor/escalation support.