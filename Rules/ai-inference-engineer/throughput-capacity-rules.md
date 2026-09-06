# Throughput and Capacity Rules

## Purpose
Ensure serving capacity is sufficient for expected demand, burst traffic, and defined failure scenarios.

## Scope
Requests per second, tokens per second, accelerator utilization, concurrency, headroom, and growth planning.

## MUST
- Capacity models MUST use representative request sizes, sequence lengths, concurrency, and model versions.
- Critical services MUST maintain documented headroom for expected demand and defined failure scenarios.
- Capacity tests MUST include burst behavior and skewed traffic, not only steady-state averages.
- Saturation indicators MUST be monitored before user-visible SLO failure.
- Major model or runtime changes MUST be re-capacity-tested before broad rollout.

## MUST NOT
- MUST NOT infer production capacity from single-request benchmark results.
- MUST NOT treat accelerator utilization alone as proof that throughput is optimal.
- MUST NOT depend on emergency quota increases as the normal scaling strategy.

## SHOULD
- Track effective throughput per accelerator and per model class.
- Forecast demand using business growth and model-mix assumptions.

## Exceptions
Reduced headroom requires documented duration, risk, mitigation, and approval.

## Verification
Inspect capacity models, load-test results, saturation dashboards, quota limits, and forecast assumptions.