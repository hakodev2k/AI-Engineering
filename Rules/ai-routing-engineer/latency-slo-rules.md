# Latency SLO Rules

## Purpose
Route AI traffic to meet user-facing latency objectives without masking reliability or quality failures.

## Scope
Time-to-first-token, total latency, queueing, provider latency, routing overhead, and percentile objectives.

## MUST
- Production routes MUST define latency objectives appropriate to their task class and interaction pattern.
- Latency decisions MUST use percentile measurements from representative traffic, not averages alone.
- Routing overhead MUST be measured separately from model/provider execution where practical.
- Routes that exceed mandatory latency objectives MUST have explicit degradation or fallback behavior.
- Latency regressions caused by configuration changes MUST be observable by route version.

## MUST NOT
- MUST NOT declare an optimization successful without before/after measurements.
- MUST NOT satisfy latency targets by truncating required work or violating quality and safety requirements.
- MUST NOT hide queueing delay inside uninstrumented routing layers.

## SHOULD
- Track time-to-first-token and end-to-end completion separately for streaming workloads.
- Segment latency by provider, model, region, task class, and fallback status.

## Exceptions
Exceptions require measured impact, duration, mitigation, and approval for affected SLOs.

## Verification
Inspect latency dashboards, traces, load tests, route comparisons, and SLO alert configuration.