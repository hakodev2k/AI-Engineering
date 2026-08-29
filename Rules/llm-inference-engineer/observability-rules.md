# Observability Rules

## Purpose
Provide enough evidence to diagnose inference quality, latency, capacity, and availability without exposing sensitive request content.

## Scope
Applies to metrics, logs, traces, dashboards, model-server telemetry, accelerator telemetry, and request correlation.

## MUST
- Observability MUST expose request rate, error rate, queue delay, time to first token, generation latency, token throughput, memory pressure, and accelerator saturation where relevant.
- Model version, runtime version, deployment version, and routing decision MUST be traceable for production requests without logging sensitive payloads by default.
- Alerts MUST map to actionable failure conditions and documented ownership.
- Telemetry pipelines MUST distinguish serving failures from client cancellations and policy rejections.
- Production conclusions MUST use available logs, metrics, traces, and system evidence rather than operator intuition alone.

## MUST NOT
- MUST NOT log prompts, generated content, authentication data, or tenant secrets unless explicitly authorized and protected for a documented purpose.
- MUST NOT use high-cardinality labels that can destabilize monitoring systems without review.
- MUST NOT suppress accelerator or memory errors to keep dashboards green.

## SHOULD
- Dashboards SHOULD separate prefill, decode, queueing, and downstream latency.
- Telemetry SHOULD support comparison by model, runtime, hardware class, and release.

## Exceptions
Sensitive-content logging requires explicit purpose, minimization, retention controls, access controls, and human approval.

## Verification
Inspect dashboards, metric definitions, trace samples, logging configuration, alert routes, and data-retention controls. Test that a failed request can be correlated to its serving version and resource state.