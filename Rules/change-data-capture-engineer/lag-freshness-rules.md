# Lag and Freshness Rules

## Purpose
Keep change propagation within explicit business and operational freshness objectives.

## Scope
Source lag, capture lag, transport lag, sink lag, end-to-end freshness, and alerting.

## MUST
- Freshness objectives MUST be defined at the consumer-relevant boundary.
- Lag measurement MUST distinguish source inactivity from pipeline delay where possible.
- Critical pipelines MUST alert before retained source history is at risk.
- Lag metrics MUST expose sustained backlog as well as current delay.
- Recovery from backlog MUST be capacity-tested for important workloads.

## MUST NOT
- MUST NOT use connector heartbeat alone as evidence that business changes are current.
- MUST NOT hide lag by resetting checkpoints.
- MUST NOT claim real-time behavior without measured end-to-end latency.

## SHOULD
- Track percentile end-to-end propagation delay.
- Forecast time-to-retention-exhaustion during incidents.

## Exceptions
Temporary freshness degradation requires consumer communication and tracked recovery.

## Verification
Review dashboards, synthetic change probes, alert thresholds, retention headroom, and backlog-drain tests.