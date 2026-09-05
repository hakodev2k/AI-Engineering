# Latency and Packet Loss Rules

## Purpose
Protect service reliability by treating latency, jitter, and packet loss as first-class network health signals.

## Scope
Production traffic paths, inter-region links, shared gateways, and critical service dependencies.

## MUST
- Reliability objectives MUST define acceptable latency and loss where they materially affect users or systems.
- Investigations MUST distinguish application delay from network transit delay using available evidence.
- Performance regressions MUST be compared against a known baseline before remediation is declared successful.
- Critical paths MUST be monitored from representative vantage points.

## MUST NOT
- MUST NOT infer root cause from a single latency sample.
- MUST NOT claim improvement without before/after measurements.
- MUST NOT ignore intermittent degradation merely because averages remain acceptable.

## SHOULD
- Prefer percentile and distribution views over averages alone.
- Correlate latency changes with utilization, path changes, and incident timelines.

## Exceptions
Exceptions require documented measurement limitations and alternative evidence.

## Verification
Inspect time-series metrics, synthetic checks, traces where available, incident evidence, and baseline comparisons.