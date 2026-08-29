# Cost Efficiency Rules

## Purpose
Control inference cost without sacrificing agreed reliability, quality, security, or latency.

## Scope
Applies to accelerator selection, utilization, batching, quantization, model choice, autoscaling, reserved capacity, and cost-per-token analysis.

## MUST
- Cost optimization MUST be evaluated against quality, latency, error rate, and reliability guardrails.
- Cost comparisons MUST use normalized units such as cost per successful request or generated token under representative workload conditions.
- Major cost-reduction claims MUST include before-and-after measurements and identify any quality or SLO trade-offs.
- Idle capacity, underutilized accelerators, cache waste, and overprovisioning MUST be observable where economically material.
- Model or hardware substitutions made for cost reasons MUST pass compatibility and quality validation.

## MUST NOT
- MUST NOT reduce redundancy or headroom below approved reliability requirements solely to lower cost.
- MUST NOT compare nominal hourly accelerator prices without considering effective throughput and utilization.
- MUST NOT hide failed requests, fallback usage, or throttling when reporting unit economics.
- MUST NOT weaken security or privacy controls to reduce serving cost.

## SHOULD
- Cost analysis SHOULD distinguish prefill-heavy and decode-heavy workloads when their economics differ.
- Capacity purchasing SHOULD consider realistic utilization, availability requirements, and demand uncertainty.

## Exceptions
Exceptions require documented business rationale, measured impact, risk, duration, and approval when user-facing SLOs or resilience are reduced.

## Verification
Review billing data, utilization telemetry, benchmark results, unit-cost calculations, quality metrics, and reliability guardrails.