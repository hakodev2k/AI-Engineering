# Performance and Capacity Rules

## Purpose
Maintain predictable latency, throughput, and headroom as workloads grow.

## Scope
Capacity planning, benchmarking, resource saturation, scaling, and performance changes.

## MUST
- Critical workloads MUST have measurable latency, throughput, and availability objectives.
- Capacity plans MUST consider data growth, traffic growth, replication, maintenance, failover, and skew.
- Performance claims MUST use before/after measurements under representative conditions.
- Production systems MUST retain enough headroom for expected failover and maintenance scenarios.

## MUST NOT
- MUST NOT infer scalability from average utilization alone.
- MUST NOT benchmark only uniform synthetic distributions when production is skewed.
- MUST NOT remove safety margins solely to reduce cost without risk approval.

## SHOULD
- Saturation thresholds SHOULD trigger scaling or load-shedding before user-facing failure.

## Exceptions
Temporary capacity risk requires explicit duration, monitoring, owner, and mitigation.

## Verification
Use benchmarks, percentile latency, saturation metrics, growth forecasts, and failover capacity tests.