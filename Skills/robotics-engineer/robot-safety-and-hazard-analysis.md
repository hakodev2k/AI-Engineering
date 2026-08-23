# Robot Safety and Hazard Analysis

## Purpose
Identify physical hazards, define risk controls, and verify that robot behavior fails toward a safe state across normal, degraded, and fault conditions.

## When to use
Use for new platforms, new hazardous capabilities, deployment changes, autonomy changes, or safety review before field operation.

## Inputs
Robot capabilities, operating environment, people interaction, energy sources, failure modes, applicable standards/policies, emergency mechanisms.

## Preconditions
System scope, operating modes, and intended environment are defined.

## Context to inspect
Emergency stop chain, protective stops, limits, watchdogs, interlocks, mode transitions, actuator power removal, remote control, recovery procedures.

## Core knowledge
Safety requires hazard identification, risk reduction by design, independent protection where warranted, and evidence that controls work. Software assertions alone are not equivalent to hardware safety functions.

## Procedure
1. Define operational modes and exposed people/assets.
2. Identify hazards from motion, stored energy, payloads, tools, batteries, environment, and software faults.
3. Estimate severity, exposure, and controllability using the applicable risk process.
4. Eliminate hazards by design where feasible.
5. Add engineered safeguards and conservative limits.
6. Define emergency/protective stop behavior and reset conditions.
7. Analyze single-point failures and unsafe combinations.
8. Define verification tests for each safety control.
9. Exercise degraded sensors, communication loss, stuck commands, and power anomalies.
10. Record residual risk, approvals, and operating constraints.

## Decision points
Prefer inherently safe design over procedural mitigation. Use independent safety-rated components when ordinary software/hardware cannot provide the required integrity.

## Common failure patterns
Treating E-stop as the only control, automatic restart after fault, unsafe reset location, hidden stored energy, software-only limits with no independent enforcement, and untested degraded modes.

## Verification
Trace each hazard to controls and test evidence. Verify stop distances/times, limit enforcement, restart interlocks, and fault responses on representative hardware.

## Expected output
Hazard log, risk controls, safety requirements, verification evidence, residual risks, and escalation items.

## Stop conditions
Stop operation when a high-risk hazard lacks an adequate control, safety evidence is incomplete, or a required approval is missing.