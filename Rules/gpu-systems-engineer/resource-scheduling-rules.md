# GPU Resource Scheduling Rules

## Purpose
Prevent contention, starvation, unsafe oversubscription, and misleading capacity assumptions.

## Scope
GPU allocation, sharing, partitioning, admission control, priorities, and workload placement.

## MUST
- Scheduling policy MUST define resource ownership, isolation expectations, priority, and oversubscription behavior.
- Admission decisions MUST account for memory as well as compute demand.
- Shared-device workloads MUST be tested under realistic contention.
- Capacity limits MUST be observable and enforced before uncontrolled OOM or latency collapse.
- Priority mechanisms MUST have documented starvation safeguards where required.

## MUST NOT
- MUST NOT assume average utilization proves spare capacity for latency-sensitive workloads.
- MUST NOT colocate mutually untrusted workloads without an approved isolation model.
- MUST NOT bypass scheduler controls for production convenience without approval.

## SHOULD
- Use workload classes and measured service objectives to guide placement.
- Reserve headroom for recovery and burst behavior.

## Exceptions
Temporary manual placement requires owner, duration, risk, monitoring, and rollback criteria.

## Verification
Review scheduler configuration, contention tests, utilization/memory telemetry, admission logs, and SLO behavior.