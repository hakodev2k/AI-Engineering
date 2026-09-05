# Workload Demand Modeling

## Purpose
Build a defensible demand model for AI workloads so compute, memory, network, and serving capacity can be planned before saturation or waste occurs.

## When to use
Use for quarterly capacity planning, launch readiness, rapid growth, regional expansion, model upgrades, or unexplained utilization pressure. Do not use raw request count alone when token volume, sequence length, batch size, or model size materially changes resource demand.

## Inputs
Historical request volume, input/output tokens, concurrency, model mix, sequence lengths, batch jobs, tenant growth, product forecasts, latency SLOs, seasonality, deployment topology.

## Preconditions
Telemetry must distinguish workload classes and model versions. Business forecasts should be labeled by confidence level.

## Context to inspect
Traffic routing, batching, autoscaling, quotas, regional demand, retry behavior, scheduled jobs, model lifecycle, launch calendar, hardware pool constraints.

## Core knowledge
AI demand is multidimensional. Requests with equal counts can have radically different GPU cost because prefill, decode, context length, output length, architecture, precision, and batching efficiency differ. Senior planning separates baseline, organic growth, launch-driven growth, and uncertainty.

## Procedure
1. Segment demand by model, workload, region, tenant class, and latency target.
2. Normalize resource drivers such as tokens, sequence length, batch size, and concurrency.
3. Remove retries and duplicated traffic from primary demand estimates while modeling them as failure overhead.
4. Identify seasonality and peak-to-average behavior.
5. Build baseline, expected, and high-demand scenarios.
6. Translate product forecasts into technical demand units.
7. Validate forecasts against recent actuals.
8. Record assumptions and confidence intervals.
9. Refresh the model when product or model behavior changes materially.

## Decision points
Use separate demand models when online serving and offline training/batch workloads compete for different capacity characteristics. Prefer conservative scenarios for long lead-time hardware.

## Common failure patterns
Planning from average RPS, ignoring output-token growth, mixing retries with real demand, using one global growth rate, and treating product forecasts as certainty.

## Verification
Back-test the model against previous periods and compare forecast error by workload segment.

## Expected output
A versioned demand forecast with scenarios, assumptions, uncertainty, and resource-driving variables.

## Stop conditions
Escalate when telemetry cannot distinguish major workload classes or business forecasts are too incomplete to support procurement decisions.