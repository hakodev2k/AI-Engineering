# Cost Efficiency Rules

## Purpose
Control AI infrastructure cost without compromising required reliability, performance, or security.

## Scope
Applies to accelerator utilization, reservations, storage tiers, network cost, idle resources, and workload placement.

## MUST
- Material cost decisions MUST use measured utilization, unit cost, workload criticality, and service objectives.
- Idle or stranded accelerator capacity MUST be measurable and assigned an owner or remediation path.
- Cost optimizations affecting latency, accuracy, availability, or recovery MUST quantify the trade-off.
- Large capacity commitments MUST have demand evidence and approval.

## MUST NOT
- MUST NOT claim savings without comparing equivalent workload output and service quality.
- MUST NOT reduce redundancy or security solely for cost without explicit risk acceptance.
- MUST NOT optimize for allocated GPU hours while ignoring useful-work efficiency.

## SHOULD
- Unit economics SHOULD be tracked per training run, inference unit, or workload class when practical.
- Lower-cost capacity SHOULD be used for interruption-tolerant workloads.

## Exceptions
Exceptions require financial and technical rationale, risk, expiry, and approval.

## Verification
Review cost allocation, utilization, commitment coverage, idle-resource reports, workload metrics, and before/after cost evidence.