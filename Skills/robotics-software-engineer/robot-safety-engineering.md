# Robot Safety Engineering

## Purpose
Integrate safety constraints into robotics software architecture, control, supervision, validation, and operational recovery.

## When to use
Use when designing motion authority, emergency behavior, protective stops, speed/force limits, safety monitors, or reviewing changes that affect hazards.

## Inputs
- Hazard analysis and safety requirements
- Robot capabilities and environment
- Safety hardware architecture
- Control and autonomy design
- Applicable standards and internal policies

## Preconditions
Software must not replace required certified safety functions or bypass established safety controls.

## Context to inspect
Inspect emergency-stop circuits, safety PLC/controllers, watchdogs, command arbitration, speed/torque limits, zone monitoring, fault handling, restart behavior, and operator procedures.

## Core knowledge
Understand hazard analysis, fail-safe versus fail-operational behavior, independent safety channels, fault detection, safe state, risk reduction, restart interlocks, and verification evidence.

## Procedure
1. Identify hazards affected by the software change.
2. Map each hazard to preventive, detective, and mitigating controls.
3. Separate safety-critical authority from convenience/autonomy logic where feasible.
4. Define safe state and degraded states explicitly.
5. Validate command limits at the lowest practical layer.
6. Add independent watchdogs and plausibility checks where appropriate.
7. Define behavior for stale commands, sensor disagreement, localization loss, and software crash.
8. Require deliberate recovery and restart transitions after safety faults.
9. Test faults with controlled simulation/HIL before physical execution.
10. Collect evidence that required safety mechanisms remain independent and effective.
11. Route safety-impacting changes through required review/approval.

## Decision points
Use independent hardware safety for hazards whose mitigation cannot depend on general-purpose software. Choose stop versus degraded operation based on hazard analysis, not availability preference.

## Common failure patterns
- Treating emergency stop as normal software command
- Automatic restart after a safety trip
- One software process both creates and validates a hazardous command
- Safety limits only in high-level planning
- Suppressing repeated fault signals without root cause

## Verification
Verify safe-state entry, watchdogs, command limits, restart interlocks, fault injection, and independence of safety controls. Distinguish implemented protections from approved/certified protections.

## Expected output
A safety-aware software design with hazard-linked controls, safe states, test evidence, and escalation requirements.

## Stop conditions
Stop and escalate for any change that weakens certified controls, requires bypassing interlocks, lacks a defined safe state, or exceeds the engineer's authorized safety scope.