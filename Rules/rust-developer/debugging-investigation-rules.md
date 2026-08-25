# Debugging and Investigation

## Purpose
Drive defect resolution from evidence and root cause rather than speculative code changes.

## Scope
Crashes, panics, memory faults, concurrency failures, performance incidents, and functional defects.

## MUST
- Investigations MUST preserve relevant evidence before destructive cleanup or broad changes.
- Root cause MUST be identified or bounded by evidence before broad corrective refactoring.
- Reproduction steps, affected versions, and environmental assumptions MUST be recorded for significant defects.
- Fixes MUST address the demonstrated failure mechanism and include regression evidence when practical.

## MUST NOT
- MUST NOT suppress panics, errors, or warnings merely to hide symptoms.
- MUST NOT claim causality from correlation without supporting evidence.
- MUST NOT enable unsafe diagnostic behavior in production without authorization.

## SHOULD
- Form falsifiable hypotheses and use minimal experiments.
- Use logs, traces, core dumps, debuggers, sanitizers, Miri, and profiles appropriate to the failure class.

## Exceptions
Urgent containment may precede root-cause completion, but containment and permanent remediation must be distinguished.

## Verification
Review evidence trail, reproduce before/after where feasible, run targeted tests, and confirm telemetry no longer shows the failure signature.