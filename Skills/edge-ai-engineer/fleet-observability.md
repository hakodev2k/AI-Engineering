# Fleet Observability

## Purpose
Operate edge AI fleets with telemetry that reveals model version, inference health, resource pressure, hardware differences, and failure patterns without overwhelming bandwidth, storage, or privacy budgets.

## When to use
Use when deploying AI across many devices, diagnosing field-only regressions, measuring rollout health, or designing production telemetry for edge inference.

## Inputs
Fleet topology, model/runtime versions, device capabilities, telemetry transport, bandwidth budget, privacy constraints, incident requirements, and service-level objectives.

## Preconditions
Define what decisions telemetry must support and what raw data must never be collected.

## Context to inspect
Logs, metrics, traces, local ring buffers, upload schedules, sampling, device identity, model manifest, crash reports, network retry behavior, and time synchronization.

## Core knowledge
Central observability must account for disconnected devices, delayed uploads, version skew, heterogeneous hardware, and biased samples from devices that can successfully report. High-cardinality dimensions are useful but costly. Raw sensor capture can create privacy and bandwidth risk; metadata and carefully sampled exemplars are usually safer defaults.

## Procedure
1. Define fleet health questions before defining metrics.
2. Tag telemetry with device class, firmware, runtime, model, and configuration versions.
3. Measure inference count, latency percentiles, failure rate, queue depth, memory, temperature, power indicators, and fallback usage where relevant.
4. Add model-output health signals that do not require ground truth when possible.
5. Keep local bounded diagnostic buffers for recent context.
6. Sample and aggregate before upload according to bandwidth budgets.
7. Protect sensitive payloads and avoid collecting raw inputs by default.
8. Account for offline devices separately from healthy reporting devices.
9. Define rollout dashboards and alert thresholds.
10. Correlate regressions by hardware/software cohort.
11. Test telemetry backpressure and server unavailability.

## Decision points
Prefer metrics for fleet-wide trends, logs for discrete failures, and traces for sampled path diagnosis. Upload detailed diagnostic bundles only under controlled triggers when privacy policy permits.

## Common failure patterns
No model-version tags, reporting averages only, telemetry queues consuming device storage, ignoring non-reporting devices, raw user data in logs, and alerts that do not distinguish hardware cohorts.

## Verification
Simulate offline periods, high error rates, model rollouts, and telemetry-server failure; confirm bounded local storage and usable cohort-level diagnosis.

## Expected output
A resource-bounded fleet observability design with actionable metrics, version correlation, privacy controls, and incident diagnostics.

## Stop conditions
Stop when required telemetry violates privacy/data policy or cannot be bounded within device and network budgets.