# Hierarchical Forecasting

## Purpose
Generate coherent forecasts across nested business or operational hierarchies where child and parent totals must reconcile.

## When to use
Use for product-category-region, site-cluster-network, account-team-company, or similar nested series.

## Inputs
Hierarchy definition, historical series at all levels, horizon, business aggregation rules, backtest protocol.

## Context to inspect
Inspect changing membership, sparse leaves, aggregation weights, temporal aggregation, reporting expectations, and whether reconciliation must be exact.

## Core knowledge
Bottom-up, top-down, middle-out, and statistical reconciliation methods trade local accuracy, coherence, stability, and cold-start behavior. Independently forecasting every level usually creates inconsistent totals.

## Procedure
1. Validate hierarchy keys and effective dates.
2. Define aggregation matrix and reconciliation constraints.
3. Establish naive coherent baselines.
4. Train base forecasts at appropriate levels.
5. Evaluate bottom-up and at least one reconciled alternative.
6. Measure accuracy at every business-relevant level.
7. Check coherence numerically after reconciliation.
8. Analyze sparse leaves and new entities separately.
9. Handle hierarchy changes with versioned membership logic.
10. Assess whether improving upper-level accuracy damages critical leaves.
11. Test runtime and scalability for large hierarchies.
12. Package hierarchy metadata with forecast artifacts.

## Decision points
Bottom-up is simple and preserves leaf detail but can amplify noisy leaves. Top-down is stable at aggregate level but loses local signal. Reconciliation is useful when accuracy across levels and exact coherence both matter.

## Common failure patterns
Static hierarchy assumptions, double counting, evaluating only aggregate accuracy, forcing reconciliation with incorrect aggregation weights, and ignoring new or retired entities.

## Verification
Verify aggregation identities, historical hierarchy reconstruction, level-specific metrics, and coherence for every forecast timestamp.

## Expected output
A hierarchy-aware forecast pipeline with versioned aggregation rules, reconciled outputs, and level-by-level evaluation.

## Stop conditions
Stop if hierarchy definitions are inconsistent, effective dates are missing, or required coherence rules conflict with business semantics.