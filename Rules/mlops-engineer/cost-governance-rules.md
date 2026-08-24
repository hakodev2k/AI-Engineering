# Cost Governance Rules

## Purpose
Control ML infrastructure spend without compromising required quality, security, or reliability.

## Scope
Covers training, tuning, storage, feature computation, inference, accelerators, networking, and managed ML services.

## MUST
- Material workloads MUST expose cost attribution by workload, environment, team/project, or another accountable dimension.
- Expensive recurring jobs MUST have resource bounds, ownership, and termination behavior.
- Cost optimization claims MUST be measured against equivalent quality and reliability requirements.
- Unexpected spend growth MUST be detectable through budgets, anomaly alerts, or equivalent controls.
- Large cost-impacting architecture changes MUST document expected unit economics and uncertainty.

## MUST NOT
- Idle high-cost resources MUST NOT be left indefinitely without ownership or lifecycle policy.
- Cost reduction MUST NOT silently weaken evaluation, security, backup, or reliability controls.

## SHOULD
- Teams SHOULD track useful unit metrics such as cost per training run, successful experiment, thousand predictions, or processed record.
- Spot/preemptible capacity SHOULD be used for interruption-tolerant work when recovery is validated.

## Exceptions
Temporary cost overruns require business/technical rationale, budget owner awareness, duration, and follow-up.

## Verification
Inspect billing allocation, budgets, anomaly alerts, utilization, job limits, lifecycle policies, unit-cost trends, and architecture decision evidence.