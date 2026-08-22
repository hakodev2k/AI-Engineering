# Lifecycle Hooks
## Intake hook
Reject work with no audience, goal, source of truth, or accountable owner when those are required to verify claims.

## Pre-create hook
Confirm version, environment, auth model, licensing, and release state before creating examples.

## Pre-publish hook
Require runnable verification, link check, independent review, and applicable approval gates.

## Post-publish hook
Capture activation, failure themes, stale references, and high-signal community feedback.

## Staleness hook
Revalidate assets when API/SDK versions change, the configured freshness window expires, or a repeated issue indicates drift.

Hooks are deterministic, idempotent where possible, and never mutate production systems.