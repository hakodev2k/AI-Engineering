# Policy Versioning and Change Management

## Purpose
Change guardrail policy with traceability, evaluation, staged rollout, rollback.

## When to use
Use for taxonomy, thresholds, exceptions, enforcement changes.

## Inputs
Current/proposed policy, rationale, corpus, products, controls, rollout constraints.

## Context to inspect
Inspect dependencies, decisions, dashboards, caches, prompts, classifiers, tests.

## Core knowledge
Semantic changes invalidate labels, thresholds, caches, metrics, and comparisons. Version decisions.

## Procedure
1. Assign version/changelog.
2. Identify deltas.
3. Map dependencies.
4. Relabel impacted cases.
5. Re-evaluate.
6. Shadow/dual-evaluate.
7. Stage rollout.
8. Monitor deltas.
9. Preserve rollback.
10. Retire safely.

## Decision points
Use dual evaluation for broad changes; avoid mixed versions per request unless designed.

## Common failure patterns
In-place edits, no log version, stale caches, invalid comparisons, irreversible rollout.

## Verification
Reproduce versions and rollback.

## Expected output
Versioned release and evidence.

## Stop conditions
Stop on unexplained critical deltas.