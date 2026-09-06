# GPU Observability Rules

## Purpose
Provide production evidence for GPU health, saturation, and performance regressions.

## Scope
Utilization, memory, clocks, power, errors, queueing, kernel time, communication, and workload metadata.

## MUST
- Production telemetry MUST expose accelerator utilization, memory pressure, error state, and workload-level latency or throughput where relevant.
- Alerts MUST distinguish capacity saturation from device faults and application regressions when evidence permits.
- Performance incidents MUST correlate GPU telemetry with deployment and workload changes.
- Sensitive payloads MUST NOT be included in traces solely for performance debugging.

## MUST NOT
- MUST NOT treat utilization percentage alone as proof of efficient execution.
- MUST NOT suppress recurrent hardware or runtime errors without investigation.
- MUST NOT rely on sampling intervals too coarse to detect known transient failure modes without documenting the gap.

## SHOULD
- SHOULD track per-device and fleet-level distributions.
- SHOULD annotate dashboards with software and model releases.

## Exceptions
Telemetry reductions require cost, privacy, or platform rationale plus alternative evidence.

## Verification
Inspect dashboards, alert definitions, telemetry retention, incident traces, and release annotations.