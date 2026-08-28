# GPU Scheduling Rules

## Purpose
Protect accelerator utilization, fairness, and workload predictability.

## Scope
Applies to batch training, inference, experimentation, gang scheduling, quotas, and preemption.

## MUST
- Scheduling policies MUST define priority, quota, preemption, and starvation behavior.
- Distributed jobs MUST request resources consistent with topology and communication requirements.
- Queueing objectives for production-critical workloads MUST be measurable.
- Preemptible workloads MUST be checkpoint-safe before relying on preemption.

## MUST NOT
- MUST NOT allow unbounded best-effort workloads to starve critical services.
- MUST NOT reserve accelerators indefinitely without active work or explicit exception.
- MUST NOT assume equal GPU models are interchangeable when memory, interconnect, or software support differs.

## SHOULD
- Fragmentation SHOULD be monitored and reduced through workload sizing and placement policies.
- Scheduling efficiency SHOULD be evaluated by useful work, not allocation alone.

## Exceptions
Exceptions require workload justification, expected duration, impact analysis, and owner approval.

## Verification
Inspect scheduler policy, quotas, queue metrics, idle allocation, preemption outcomes, and distributed-job placement evidence.