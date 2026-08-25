# BI Observability

## Purpose
Make BI data products observable across ingestion, transformation, refresh, semantic serving, and dashboard consumption.

## When to use
Use when operating production BI, defining SLAs/SLOs, reducing silent failures, or improving incident diagnosis.

## Inputs
Pipeline logs, refresh history, query telemetry, quality results, lineage, SLAs, capacity metrics, usage data.

## Context to inspect
Inspect orchestration, warehouse jobs, semantic refresh, gateway/network, dashboard telemetry, alert rules, and incident history.

## Core knowledge
Useful BI observability connects technical signals to consumer impact. Key signals include freshness, completeness, job success, latency, query errors, capacity saturation, and affected downstream assets.

## Procedure
1. Identify critical BI products and their consumer-facing objectives.
2. Map dependencies from sources to dashboards.
3. Define freshness, availability, correctness, and latency indicators.
4. Instrument pipeline and semantic refresh stages with correlation identifiers.
5. Capture query latency/error and capacity signals.
6. Integrate data-quality results into health state.
7. Alert on actionable symptoms with ownership and impact context.
8. Build dependency-aware incident views.
9. Retain enough history for baseline and regression analysis.
10. Review alert precision and coverage after incidents.

## Decision points
Alert on symptoms when user impact is clear; use cause-oriented alerts when they enable earlier action without noise. Page only for conditions requiring immediate human response.

## Common failure patterns
Success-only job monitoring, no downstream impact mapping, alert storms, dashboards monitoring themselves without external checks, and freshness measured from job completion instead of data event time.

## Verification
Simulate failures and stale data, confirm alerts route correctly, and verify telemetry identifies affected assets and likely failure stage.

## Expected output
Observable BI estate with defined indicators, dependency context, actionable alerts, and diagnostic evidence.

## Stop conditions
Stop when critical ownership/SLOs are undefined or required telemetry cannot be collected without platform/security approval.