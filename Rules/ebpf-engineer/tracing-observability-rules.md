# Tracing and Observability

## Purpose
Ensure eBPF telemetry is semantically correct, attributable, and operationally useful.

## Scope
Tracing hooks, metrics, events, context propagation, aggregation, cardinality, timestamps, and interpretation.

## MUST
- Every metric/event MUST have documented semantics, units, dimensions, and known blind spots.
- Aggregation MUST preserve the meaning required by downstream conclusions.
- Telemetry MUST expose collection health, attachment state, and loss where relevant.
- Time measurements MUST use clocks appropriate to the intended duration or ordering semantics.
- Identity fields such as PID/TGID, cgroup, namespace, CPU, and process identity MUST be interpreted according to kernel semantics.

## MUST NOT
- MUST NOT present sampled telemetry as complete without disclosure.
- MUST NOT create uncontrolled high-cardinality labels.
- MUST NOT treat absence of events as proof of absence when collection health is unknown.

## SHOULD
- Prefer stable semantic hooks and bounded dimensions.
- Correlate kernel telemetry with userspace context only through explicit identity rules.

## Exceptions
Exceptions require documented analytical limitations and consumer-facing disclosure.

## Verification
Compare telemetry against controlled workloads and independent references; test loss, restart, namespace, and high-cardinality scenarios.