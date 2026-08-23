# Runbook Execution and Adaptation

## Purpose
Use operational runbooks safely while adapting to evidence when the current incident differs from documented assumptions.

## When to use
Use whenever a known incident pattern or mitigation has an established runbook.

## Inputs
Current runbook, incident evidence, environment state, permissions, dependencies, and rollback procedures.

## Context to inspect
Inspect runbook freshness, target environment, prerequisites, destructive steps, expected signals, ownership, and changes since the runbook was validated.

## Core knowledge
Runbooks reduce cognitive load but are not executable truth. Senior responders validate assumptions before each consequential step and stop when observed behavior diverges materially.

## Procedure
1. Confirm the runbook matches the incident class and environment.
2. Check prerequisites, permissions, and current topology.
3. Identify destructive or irreversible steps before execution.
4. Record starting health and state.
5. Execute one consequential step at a time.
6. Compare actual results with expected results.
7. Pause and investigate when assumptions fail.
8. Adapt only with explicit rationale and bounded risk.
9. Verify recovery independently after completion.
10. Capture runbook corrections and missing diagnostics for follow-up.

## Decision points
Follow the runbook when assumptions hold; deviate when evidence demonstrates they do not. Prefer reversible adaptation and peer review for high-risk changes.

## Common failure patterns
Blind execution, wrong environment, stale commands, skipping verification, continuing after unexpected output, and editing the runbook during the incident without recording deviations.

## Verification
Confirm each critical step produced its expected state and final recovery criteria are independently satisfied.

## Expected output
An execution record showing steps, results, deviations, rationale, and proposed runbook improvements.

## Stop conditions
Stop on unexpected destructive effects, missing prerequisites, stale environment assumptions, or commands requiring authorization not currently granted.