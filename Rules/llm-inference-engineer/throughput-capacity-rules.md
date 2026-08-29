# Throughput and Capacity Rules

## Purpose
Ensure inference capacity is sized from evidence and remains safe under expected and burst traffic.

## Scope
Applies to token throughput, request concurrency, accelerator capacity, headroom, workload forecasting, and saturation analysis.

## MUST
- Capacity plans MUST use representative prompt length, output length, concurrency, and model mix.
- Sustainable throughput MUST be measured at an acceptable latency and error level.
- Production capacity MUST include documented headroom for bursts, failures, deployments, and model variance.
- Saturation signals MUST include device utilization, memory pressure, queue depth, and token throughput where available.
- Capacity assumptions MUST be revisited after material model, hardware, runtime, or traffic changes.

## MUST NOT
- MUST NOT size capacity from theoretical accelerator FLOPS alone.
- MUST NOT equate peak benchmark throughput with sustainable production throughput.
- MUST NOT run routinely at a resource level that leaves no failure or rollout headroom.

## SHOULD
- Capacity models SHOULD separate prefill-bound and decode-bound workloads where their scaling behavior differs.
- Forecasts SHOULD include seasonal and launch-related demand uncertainty.

## Exceptions
Reduced headroom requires documented business justification, risk, operational safeguards, and approval.

## Verification
Review load tests, utilization telemetry, queue behavior, forecasting inputs, failure simulations, and headroom calculations.