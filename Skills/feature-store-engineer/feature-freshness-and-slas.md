# Feature Freshness and SLAs

## Purpose
Define and operate measurable freshness guarantees from source event to consumer-visible feature.

## When to use
Use for production features whose age affects prediction quality or business behavior.

## Inputs
Source cadence, event delay, pipeline schedule/latency, serving path, model sensitivity and business SLOs.

## Context to inspect
Watermarks, materialization timestamps, pipeline duration, queue lag, online timestamps and incident history.

## Core knowledge
Freshness is end-to-end age, not merely job success. Different features can tolerate different staleness; SLOs should reflect model/business impact.

## Procedure
1. Define freshness at the consumer boundary.
2. Decompose source, compute, publication and serving latency budgets.
3. Instrument timestamps at each stage.
4. Calculate age distributions, not only averages.
5. Set SLO and alert windows by criticality.
6. Define degraded behavior for stale features.
7. Test delayed-source and failed-materialization scenarios.
8. Create runbooks for dominant causes.
9. Review SLO attainment and model impact regularly.

## Decision points
Fail closed only when stale values are more harmful than missing predictions; otherwise use explicit fallback/default policies approved by model owners.

## Common failure patterns
Alerting on scheduler status only, ignoring source delay, hidden stale cache values, impossible SLOs and no degraded mode.

## Verification
Simulate delay and confirm metrics, alerts, fallback behavior and recovery match the stated SLO.

## Expected output
An end-to-end freshness SLO with telemetry and degradation policy.

## Stop conditions
Stop if consumer tolerance for stale/missing values is unknown.