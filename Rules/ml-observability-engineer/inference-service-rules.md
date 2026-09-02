# Inference Service Observability

## Purpose
Detect runtime failures that degrade model-serving correctness, latency, throughput, or availability.

## Scope
Applies to online and batch inference services, gateways, queues, accelerators, and model-serving runtimes.

## MUST
- Inference monitoring MUST measure request volume, errors, latency distributions, saturation, queueing, and model-load failures where applicable.
- Latency and error metrics MUST be segmented by model version and serving path when behavior can differ.
- Timeouts, retries, fallbacks, and rejected requests MUST be separately observable.
- Service-level metrics MUST distinguish successful transport from successful inference semantics.

## MUST NOT
- MUST NOT rely on averages alone for latency or throughput conclusions.
- MUST NOT hide retry-amplified load or fallback traffic inside aggregate success rates.
- MUST NOT declare serving health solely because process or container health checks pass.

## SHOULD
- Track cold starts, accelerator utilization, batching behavior, and queue depth when material to performance.
- Correlate serving regressions with deployments and configuration changes.

## Exceptions
Omitted signals require documented irrelevance, alternative evidence, risk, and reviewer approval for critical services.

## Verification
Review dashboards, metric dimensions, load tests, failure-injection results, alert queries, and production traces for representative failure modes.