# Developer Experience Metrics

## Purpose
Measure developer experience with actionable signals that connect friction to engineering outcomes.

## When to use
Use to baseline DX, prioritize investments, validate improvements, or detect regressions.

## Inputs
Workflow telemetry, surveys, CI/build data, support tickets, delivery metrics, and developer interviews.

## Context to inspect
Inspect measurement definitions, sampling, privacy, segmentation, confounders, and whether metrics can drive useful decisions.

## Core knowledge
Combine perceptual and behavioral measures. Useful dimensions include feedback speed, cognitive load, flow, reliability, and ease of delivery; no single metric represents productivity.

## Procedure
1. Define decisions the metrics must support.
2. Select a small balanced set of leading and outcome indicators.
3. Establish precise definitions and baselines.
4. Segment by workflow where meaningful without exposing individuals.
5. Pair telemetry with qualitative evidence.
6. Set targets tied to user outcomes.
7. Monitor trends and investigate changes.
8. Revalidate whether metrics still represent the intended outcome.

## Decision points
Prefer workflow-level aggregates over individual developer scoring. Use surveys for perception and telemetry for observable friction.

## Common failure patterns
Ranking developers, metric gaming, averages hiding tails, correlation presented as causation, survey fatigue, and collecting metrics without decisions.

## Verification
Audit calculations, reproduce dashboards from source data, validate interpretations with developers, and confirm changes correspond to observed workflow improvements.

## Expected output
A privacy-aware DX measurement framework with definitions, baselines, targets, and decision rules.

## Stop conditions
Stop if measurement could become individual surveillance, data quality is insufficient, or privacy/legal constraints are unresolved.