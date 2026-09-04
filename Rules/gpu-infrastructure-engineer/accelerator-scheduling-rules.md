# Accelerator Scheduling Rules

## Purpose
Protect GPU utilization, fairness, locality, and workload reliability through explicit scheduling policy.

## Scope
Applies to queues, schedulers, quotas, reservations, priorities, placement constraints, and preemption for accelerator workloads.

## MUST
- Scheduling policy MUST define resource requests, quotas, priority classes, preemption behavior, and ownership for shared GPU capacity.
- Placement MUST account for accelerator model, count, topology, memory capacity, interconnect requirements, and workload compatibility.
- Multi-GPU jobs MUST declare locality requirements when cross-host or cross-domain placement changes performance or correctness.
- Priority or quota changes that can starve other tenants MUST be reviewed with measurable impact evidence.
- Scheduler failures and unschedulable reasons MUST be observable.

## MUST NOT
- Workloads MUST NOT request scarce accelerator capacity without bounded resource declarations when the platform supports them.
- Manual placement MUST NOT become a permanent substitute for correcting scheduler policy.
- Preemption MUST NOT be enabled for non-checkpointable critical jobs without an explicit loss assessment.

## SHOULD
- Policies SHOULD favor measurable utilization without causing pathological queue delay or tenant starvation.
- Gang scheduling SHOULD be used when distributed jobs require simultaneous placement.

## Exceptions
Exceptions require reason, duration, affected tenants, risk, and an owner responsible for restoring standard policy.

## Verification
Inspect scheduler configuration, queue metrics, quota records, placement events, pending-job reasons, preemption logs, and representative contention tests.