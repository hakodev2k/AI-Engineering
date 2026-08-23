# Quality Root Cause Analysis

## Purpose
Identify systemic causes behind escaped defects and recurring failures so corrective actions reduce recurrence.

## When to use
Use after significant defects, repeated regressions, flaky systems, or quality trends.

## Inputs
Timeline, code changes, tests, reviews, telemetry, process evidence, incident notes.

## Context to inspect
Inspect detection gaps, requirement/design decisions, test coverage, deployment controls, observability, ownership, and organizational conditions.

## Core knowledge
Root cause is rarely a single human error. Separate trigger, contributing conditions, detection failure, and impact amplifiers. Prefer evidence over hindsight.

## Procedure
1. Build a factual timeline.
2. Reproduce or characterize the failure mechanism.
3. Identify the triggering change/event.
4. Ask why prevention controls did not stop it.
5. Ask why detection controls did not detect it sooner.
6. Identify systemic contributing conditions.
7. Propose actions at prevention, detection, and recovery layers.
8. Rank actions by risk reduction and cost.
9. Assign owners and measurable completion criteria.
10. Verify recurrence risk after actions land.

## Decision points
Prefer controls that remove classes of failure over one-off checks; avoid process overhead unsupported by risk.

## Common failure patterns
Blaming individuals, stopping at the first cause, speculative narratives, and action items such as be more careful.

## Verification
Each conclusion must trace to evidence and each action to a demonstrated failure mechanism.

## Expected output
Evidence-based causes and measurable corrective actions.

## Stop conditions
Escalate when evidence is unavailable or analysis enters personnel/performance matters outside technical scope.