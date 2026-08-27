# GPU Observability Rules

## Purpose
Provide enough evidence to diagnose accelerator correctness, capacity, performance, and health issues in production.

## Scope
Metrics, logs, traces, health signals, profiling metadata, and alerting.

## MUST
- Production GPU services MUST expose device identity, utilization, memory, health/error, and workload-level latency/throughput signals as relevant.
- Telemetry MUST allow correlation between application requests and accelerator saturation without exposing sensitive payloads.
- Alerts MUST represent actionable conditions rather than raw metric noise.
- Device/runtime versions and important configuration MUST be available during incident investigation.
- Telemetry collection MUST have bounded overhead.

## MUST NOT
- MUST NOT use utilization alone as proof of efficiency or health.
- MUST NOT emit secrets or sensitive input/output data into observability systems.
- MUST NOT enable heavyweight profiling continuously without measured overhead and approval.

## SHOULD
- Correlate CPU, GPU, memory, interconnect, and queue metrics.
- Maintain dashboards for capacity and hardware-health trends.

## Exceptions
Reduced telemetry requires documented privacy, overhead, or platform reason plus alternate evidence.

## Verification
Inspect dashboards, schemas, alerts, trace correlation, redaction tests, and telemetry overhead measurements.