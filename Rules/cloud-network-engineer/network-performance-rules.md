# Network Performance Rules

## Purpose
Ensure network performance decisions are evidence-based and aligned with workload requirements.

## Scope
Applies to latency, throughput, packet loss, connection scaling, bandwidth, and network service limits.

## MUST
- Performance requirements MUST define measurable latency, throughput, and availability targets where relevant.
- Suspected network bottlenecks MUST be validated with measurements before remediation.
- Capacity changes MUST consider provider quotas, connection limits, bandwidth ceilings, and downstream constraints.
- Performance tests MUST reflect realistic traffic patterns and network paths.
- Significant tuning changes MUST include before-and-after evidence.

## MUST NOT
- MUST NOT claim improvement without measurement.
- MUST NOT optimize one network component while ignoring end-to-end bottlenecks.
- MUST NOT disable security controls solely to improve performance without explicit approval.

## SHOULD
- Prefer percentile-based latency analysis over averages alone.
- Track utilization trends before exhaustion becomes operationally urgent.

## Exceptions
Exceptions require documented measurement limitations, risk, alternative evidence, and review.

## Verification
Review benchmarks, cloud metrics, packet-loss tests, connection statistics, quotas, and before/after comparisons.