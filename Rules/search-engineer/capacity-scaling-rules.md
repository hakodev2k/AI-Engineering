# Capacity and Scaling

## Purpose
Plan search capacity before growth or recovery pressure turns into user-visible failure.

## Scope
Storage, shards, replicas, memory, CPU, network, query concurrency, and growth forecasting.

## MUST
- Forecast capacity using corpus growth, indexing rate, query traffic, retention, replication, and recovery headroom.
- Define saturation indicators and scaling thresholds before sustained production pressure.
- Include reindexing and failure-recovery resource needs in capacity plans.
- Validate scaling assumptions with representative load tests.

## MUST NOT
- Size only for steady-state averages.
- Consume recovery headroom for routine workload without an explicit risk decision.
- add shards or replicas as a universal fix without measuring the bottleneck.

## SHOULD
- Track cost and efficiency alongside headroom.
- Revisit shard sizing as corpus and traffic distributions evolve.

## Exceptions
Exceptions require quantified risk window, mitigations, owner, and review date.

## Verification
Review forecasts, saturation dashboards, load tests, shard metrics, recovery timing, and capacity-change evidence.