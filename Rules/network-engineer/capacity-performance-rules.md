# Capacity and Performance Rules

## Purpose
Prevent congestion and make performance decisions from measurements rather than intuition.

## Scope
Bandwidth, packets per second, sessions, device resources, latency, loss, jitter, and growth.

## MUST
- Establish baselines and measurable service objectives for critical paths.
- Use before/after measurements when claiming performance improvement.
- Evaluate peak utilization, burst behavior, protocol overhead, device limits, and growth before capacity changes.
- Investigate latency with path-level evidence rather than bandwidth assumptions alone.

## MUST NOT
- Declare a link healthy solely because average utilization is low.
- Oversubscribe critical capacity without documented risk and evidence.

## SHOULD
- Alert on leading indicators before user-visible saturation.

## Exceptions
Short-lived overload acceptance requires owner, duration, impact analysis, and monitoring.

## Verification
Review telemetry, percentile latency, loss/jitter, interface queues, resource utilization, synthetic tests, and capacity forecasts.