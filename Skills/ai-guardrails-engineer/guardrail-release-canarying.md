# Guardrail Release and Canarying

## Purpose
Deploy guardrail changes incrementally and detect regressions early.

## When to use
Use for material production changes.

## Inputs
Artifact, evaluation, baseline, segmentation, rollback, incident thresholds.

## Context to inspect
Inspect topology, routing, shadowing, dashboards, flags, state, rollback.

## Core knowledge
Offline metrics cannot fully predict production; shadowing/canaries reveal distribution differences with limited blast radius.

## Procedure
1. Freeze version.
2. Confirm offline gates.
3. Shadow traffic.
4. Compare baseline.
5. Investigate deltas.
6. Canary low-risk cohort.
7. Monitor safety/reliability/UX.
8. Expand through gates.
9. Roll back on breach.
10. Archive evidence.

## Decision points
Prefer shadowing for uncertain semantics; stricter gates for irreversible workflows.

## Common failure patterns
Global flips, no baseline, bad canary, stale rollback cache, health-only monitoring.

## Verification
Each stage meets gates and rollback works.

## Expected output
Staged release evidence.

## Stop conditions
Stop on critical deltas/bypasses/false positives/reliability issues.