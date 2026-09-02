# Compute Utilization Rules

## Purpose
Keep compute resources productively utilized without creating unsafe saturation or hidden reliability debt.

## Scope
Applies to virtual machines, containers, serverless runtimes, accelerators, worker fleets, and scheduled compute.

## MUST
- Compute efficiency decisions MUST use utilization distributions, queueing behavior, latency, saturation, and failure evidence rather than CPU averages alone.
- Reserved headroom MUST be traceable to burst, failover, maintenance, or recovery requirements.
- Idle or chronically underused resources MUST have an owner, justification, or retirement plan.

## MUST NOT
- MUST NOT optimize utilization to the point that normal workload variance causes service-objective violations.
- MUST NOT consolidate incompatible security or failure domains solely to raise utilization.
- MUST NOT treat high utilization as evidence of sustainability when work is redundant or unnecessary.

## SHOULD
- Prefer shared or elastic capacity when isolation and performance requirements permit.
- Schedule nonurgent work to improve useful utilization of already-provisioned capacity where safe.

## Exceptions
Exceptions require the reliability or isolation constraint, evidence, estimated unused capacity, and reassessment trigger.

## Verification
Review utilization percentiles, queue depth, throttling, headroom models, resource ownership, load tests, and post-change service metrics.
