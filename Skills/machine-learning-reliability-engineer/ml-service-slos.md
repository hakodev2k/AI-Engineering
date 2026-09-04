# ML Service SLOs

## Purpose
Define service-level objectives for machine-learning systems that cover both software reliability and model-quality reliability.

## When to use
Use when launching or reviewing an ML service, setting operational ownership, or converting vague reliability expectations into measurable targets.

## Inputs
- User journeys and business impact
- Serving architecture
- Latency and availability requirements
- Model-quality metrics
- Historical incident data

## Context to inspect
Inspect request paths, batch jobs, upstream data dependencies, fallback behavior, model refresh cadence, and critical user segments.

## Core knowledge
ML reliability includes availability, latency, freshness, prediction coverage, model quality, calibration, and data integrity. SLOs should reflect user impact rather than internal component uptime alone.

## Procedure
1. Identify critical prediction journeys.
2. Define service-level indicators for availability, latency, freshness, and prediction success.
3. Add model-quality indicators appropriate to the task.
4. Define measurement windows and segment-specific thresholds.
5. Establish error budgets and ownership.
6. Define fallback behavior when SLOs are breached.
7. Connect SLOs to alerting and release criteria.
8. Review targets against historical performance and business tolerance.

## Decision points
Use stricter SLOs for safety- or revenue-critical paths. Separate online-serving SLOs from retraining and batch inference SLOs when their failure modes differ.

## Common failure patterns
- Measuring infrastructure uptime but not prediction correctness.
- Ignoring stale features or stale models.
- Aggregating away failures in important cohorts.
- Setting unrealistic targets without error budgets.

## Verification
Verify that each SLO has a computable indicator, owner, alert threshold, and operational response. Confirm measurements can be reproduced from telemetry.

## Expected output
A documented ML reliability SLO set with indicators, targets, error budgets, and response expectations.

## Stop conditions
Stop if user impact, telemetry, or model-quality signals cannot be measured reliably.