# BI Data Quality

## Purpose
Engineer data-quality controls that protect BI consumers from incorrect, incomplete, stale, or structurally invalid analytical data.

## When to use
Use when designing pipelines/models, onboarding sources, responding to trust issues, or defining production readiness.

## Inputs
Schemas, SLAs, business invariants, historical distributions, lineage, ownership, incident history.

## Context to inspect
Inspect source contracts, transformation tests, orchestration, freshness, null/duplicate patterns, downstream criticality, and alert routing.

## Core knowledge
Quality is multidimensional: validity, completeness, uniqueness, consistency, timeliness, and semantic correctness. Tests should target business risk rather than maximize assertion count.

## Procedure
1. Rank datasets and fields by decision impact.
2. Define explicit quality expectations and owners.
3. Add schema, key, null, domain, referential, and freshness checks where meaningful.
4. Add business-invariant and reconciliation checks for critical metrics.
5. Establish baselines for volume/distribution anomaly detection.
6. Decide blocking versus warning behavior per failure class.
7. Route alerts with dataset, symptom, impact, and runbook context.
8. Quarantine or label suspect data rather than silently publishing it.
9. Track recurring defects to source or transformation root causes.
10. Review tests as semantics and data distributions evolve.

## Decision points
Block publication when correctness is materially compromised; warn when degradation is non-critical and transparent. Prefer deterministic rules over anomaly detection when a precise invariant exists.

## Common failure patterns
No ownership, alert floods, thresholds without baselines, tests after publication, checking syntax but not semantics, and silently coercing invalid values.

## Verification
Inject representative failures, confirm detection and routing, review false-positive rates, and prove critical dashboards do not consume failed data unnoticed.

## Expected output
Risk-based quality controls, ownership, alerting, publication behavior, and evidence of detection effectiveness.

## Stop conditions
Stop when business invariants are unknown, ownership cannot be established, or a blocking rule could halt critical reporting without an approved recovery path.