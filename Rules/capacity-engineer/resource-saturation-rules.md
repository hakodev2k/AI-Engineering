# Resource Saturation

## Purpose
Define how saturation is detected, interpreted, and prevented before service objectives fail.

## Scope
Applies to CPU, memory, threads, connections, file descriptors, storage IOPS, bandwidth, queues, and other finite resources.

## MUST
- Each critical resource MUST have a defined saturation indicator and operating envelope.
- Sustained saturation thresholds MUST be based on observed service impact or validated platform behavior.
- Capacity analysis MUST account for hard limits, throttling, garbage collection, contention, and resource exhaustion modes where relevant.
- Saturation alerts MUST include enough context to identify affected workload and resource pool.

## MUST NOT
- MUST NOT equate high utilization with harmful saturation without service-impact evidence.
- MUST NOT ignore hidden finite resources such as connection pools or quotas.
- MUST NOT rely on a metric that is known to omit throttled or rejected demand.

## SHOULD
- Track leading indicators such as queueing and wait time before hard saturation occurs.
- Review saturation envelopes after major platform or workload changes.

## Exceptions
Missing metrics require documented risk, alternate evidence, and a plan to restore observability.

## Verification
Inspect resource dashboards, limits, throttling metrics, queueing behavior, alerts, and incident evidence.
