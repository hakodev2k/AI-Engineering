# Capacity and Performance Rules

## Purpose
Ensure infrastructure capacity and scaling decisions are evidence-based and aligned with service objectives.

## Scope
Applies to compute, storage, databases, queues, clusters, network capacity, and autoscaling.

## MUST
- Capacity decisions MUST use measured utilization, growth, latency, throughput, or saturation evidence.
- Critical services MUST define scaling limits and behavior before expected peak events.
- Autoscaling rules MUST include safe minimums, maximums, cooldown behavior, and failure monitoring.
- Performance regressions attributed to infrastructure MUST be supported by before/after evidence.
- Capacity changes with material cost or availability impact MUST be reviewed.

## MUST NOT
- MUST NOT scale infrastructure blindly without identifying the bottleneck.
- MUST NOT claim performance improvement without measurement.
- MUST NOT set unlimited or dangerously high autoscaling ceilings without budget and dependency analysis.

## SHOULD
- Prefer load tests and trend analysis for high-growth systems.
- Track headroom for critical dependencies.

## Exceptions
Emergency scaling may precede full analysis when user impact is severe, but evidence and post-incident review are still required.

## Verification
Use metrics, load tests, autoscaling history, resource saturation signals, capacity forecasts, and cost/performance comparisons.