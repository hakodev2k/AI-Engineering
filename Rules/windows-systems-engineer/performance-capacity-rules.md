# Performance and Capacity

## Purpose
Prevent resource exhaustion and evidence-free tuning of Windows systems.

## Scope
CPU, memory, storage, network, process, session, and service capacity.

## MUST
- Performance claims MUST be supported by reproducible measurements under relevant workload.
- Capacity decisions MUST consider trend, peak demand, headroom, growth, and dependency limits.
- Bottleneck investigation MUST distinguish saturation, contention, latency, and downstream failure.
- Material tuning changes MUST record baseline, hypothesis, expected result, and rollback.

## MUST NOT
- MUST NOT disable security or durability controls solely to improve benchmark numbers without approved risk acceptance.
- MUST NOT infer root cause from a single utilization metric.
- MUST NOT claim improvement without before/after evidence.

## SHOULD
- Capture representative counters and workload context during incidents.
- Prefer removing verified bottlenecks over speculative tuning.

## Exceptions
Require reason, measurement evidence, risk, rollback, and approval for safety-impacting changes.

## Verification
Compare baseline and post-change metrics, traces/events where available, capacity reports, stress tests, and service-level outcomes.