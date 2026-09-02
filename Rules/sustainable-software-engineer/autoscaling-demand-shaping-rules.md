# Autoscaling and Demand Shaping Rules

## Purpose
Align active capacity with real demand and safely reduce avoidable peak-driven provisioning.

## Scope
Applies to horizontal and vertical scaling, queue-based workers, serverless concurrency, scheduled capacity, rate controls, and deferrable demand.

## MUST
- Autoscaling policies MUST be based on service-relevant demand and saturation signals with tested minimum, maximum, cooldown, and recovery behavior.
- Scaling limits MUST preserve required availability, latency, and recovery headroom.
- Demand-shaping mechanisms MUST define which work may be queued, deferred, batched, rate-limited, or rejected.

## MUST NOT
- MUST NOT scale down critical capacity from a single noisy metric.
- MUST NOT use demand shaping to conceal insufficient capacity for contractual or safety-critical workloads.
- MUST NOT defer work beyond documented freshness or completion objectives.

## SHOULD
- Prefer predictive or scheduled capacity only when demand patterns are sufficiently stable and verified.
- Use queues and bounded batching for deferrable burst workloads when this improves resource efficiency without unacceptable delay.

## Exceptions
Exceptions require the workload pattern, reliability constraint, scaling evidence, operational risk, and accountable approval when user-visible service behavior changes.

## Verification
Review scaling configuration, metric history, queue age, saturation, load tests, failure recovery, rate-limit behavior, and post-change service objectives.
