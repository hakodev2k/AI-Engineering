# Incident-Driven Experiment Design

## Purpose
Convert production incident evidence into focused experiments that validate remediation and expose adjacent failure paths.

## When to use
Use after significant incidents, near misses, or recurring operational failures.

## Inputs
Incident timeline, root-cause evidence, telemetry, remediation items, architecture, and user impact.

## Context to inspect
Inspect triggering conditions, contributing factors, detection gaps, recovery actions, hidden dependencies, and assumptions made during remediation.

## Core knowledge
Incidents reveal system behavior under real stress. Experiments should test the failed resilience property without assuming the postmortem's first causal explanation is complete.

## Procedure
1. Extract observable failure conditions from the incident.
2. Identify the resilience property that should have limited impact.
3. Separate trigger, amplifier, and recovery failures.
4. Form hypotheses for each important weakness.
5. Reproduce the smallest safe representative condition.
6. Validate remediation against the same evidence signals.
7. Explore one adjacent plausible variation when justified.
8. Add stable findings to regression coverage.

## Decision points
Reproduce exact incidents when necessary for confidence; otherwise test the underlying invariant to avoid brittle scenario-specific checks.

## Common failure patterns
Blaming one component, recreating unsafe production scale, validating code changes without operational controls, and ignoring detection/recovery failures.

## Verification
Show that the experiment fails before remediation or under equivalent missing controls and passes after the fix.

## Expected output
Evidence-backed validation of incident remediation and additional resilience findings.

## Stop conditions
Stop if incident evidence is insufficient to form a safe hypothesis or reproduction risks irreversible impact.