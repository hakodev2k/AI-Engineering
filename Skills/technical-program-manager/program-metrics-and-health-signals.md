# Program Metrics and Health Signals

## Purpose
Design a small set of metrics that reveal whether a technical program is progressing toward outcomes, accumulating delivery risk, or degrading operational quality.

## When to use
Use when program health is subjective, status discussions are noisy, or leaders need reliable leading and lagging indicators.

## Inputs
Program outcomes, milestones, quality criteria, operational metrics, dependency data, defect trends, delivery history.

## Context to inspect
Existing dashboards, SLOs, engineering metrics, business KPIs, milestone definitions, and data quality limitations.

## Core knowledge
Useful metrics are decision-relevant, hard to game, and interpreted in context. Senior TPMs combine outcome, flow, quality, dependency, and risk signals rather than relying on a single delivery percentage.

## Procedure
1. Start from the program outcomes and key failure modes.
2. Define a small number of outcome metrics.
3. Add leading indicators for schedule confidence, dependency aging, defect trends, or readiness.
4. Define exact formulas, owners, data sources, and update cadence.
5. Establish baseline and target ranges.
6. Identify gaming incentives and misleading interpretations.
7. Review metric movement alongside qualitative evidence.
8. Retire metrics that no longer drive decisions.

## Decision points
Prefer direct operational or business evidence over proxy metrics. Use qualitative confidence only when instrumented evidence is not yet possible, and label it clearly.

## Common failure patterns
Vanity metrics, percent-complete reporting, inconsistent formulas, stale dashboards, and optimizing metrics instead of outcomes.

## Verification
Audit source data, reproduce metric calculations, and confirm metric changes correspond to meaningful program conditions.

## Expected output
A trusted program health scorecard with definitions, targets, trends, and decision thresholds.

## Stop conditions
Stop when data quality is insufficient, metrics expose sensitive information improperly, or incentives would predictably distort behavior.