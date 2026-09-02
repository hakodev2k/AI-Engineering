# Safety-Critical Design

## Purpose
Integrate timing behavior into a safety case by identifying hazards, safe states, criticality boundaries, and evidence needed to justify real-time behavior.

## When to use
Use when failures can cause injury, equipment damage, environmental harm, or regulated safety impact.

## Inputs
Hazard analysis, safety goals, timing requirements, architecture, failure modes, applicable standards, verification evidence.

## Context to inspect
Safety mechanisms, task criticality, independence, diagnostic coverage, shutdown paths, watchdogs, hardware faults, and change-control requirements.

## Core knowledge
Safety is not equivalent to reliability. Timing faults can be hazardous even when logic is correct. Safety architecture uses hazard-driven requirements, independence, fault containment, safe-state transitions, and traceable verification evidence.

## Procedure
1. Identify hazards involving late, missing, repeated, or incorrect-timing behavior.
2. Trace hazards to safety goals and timing constraints.
3. Classify functions by criticality.
4. Define safe state and maximum transition time.
5. Separate or protect critical workloads from non-critical interference.
6. Add independent detection where single-point failure is unacceptable.
7. Define evidence required for WCET, scheduling, fault response, and testing.
8. Review common-cause failures and degraded modes.
9. Maintain requirement-to-test traceability through changes.

## Decision points
Prefer architectural independence over complex software arguments when consequences are severe. Add redundancy only when failure independence can be justified.

## Common failure patterns
Treating watchdog reset as a complete safety strategy, undocumented timing assumptions, sharing unbounded services across criticality levels, and confusing test coverage with hazard coverage.

## Verification
Use traceable safety tests, fault injection, timing analysis, independent review, and required process evidence for the applicable assurance level.

## Expected output
Hazard-linked timing requirements, safety architecture, verification obligations, and residual-risk notes.

## Stop conditions
Stop when safety classification, regulatory obligations, or approval authority is unclear and the change could affect hazardous behavior.