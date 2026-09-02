# Schedulability Analysis Rules

## Purpose
Ensure task sets can meet their timing contracts under credible worst-case conditions.

## Scope
Fixed-priority, dynamic-priority, cyclic, partitioned, and mixed-criticality scheduling.

## MUST
- Schedulability MUST be evaluated using a model appropriate to the scheduler and workload.
- Analysis MUST include execution times, blocking, preemption, release jitter, interrupt interference, and shared-resource effects where relevant.
- Any admission of new periodic or high-criticality work MUST reassess schedulability.

## MUST NOT
- MUST NOT infer schedulability from low observed CPU utilization alone.
- MUST NOT ignore lower-priority blocking or interrupt load in response-time analysis.

## SHOULD
- Maintain explicit utilization and response-time margins for growth and measurement uncertainty.

## Exceptions
An alternative method requires evidence that it bounds the same risks and documented technical approval.

## Verification
Inspect analysis artifacts, task parameters, scheduler configuration, worst-case assumptions, and stress-test evidence.