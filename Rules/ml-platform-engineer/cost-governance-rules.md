# Cost Governance

## Purpose
Make ML compute economics visible and prevent uncontrolled shared-platform spend.

## Scope
Training, inference, storage, accelerators, data transfer, idle capacity, and quotas.

## MUST
- Material platform costs MUST be attributable to service, tenant, workload, or another accountable dimension.
- Expensive workload classes MUST have quotas, budgets, or equivalent guardrails.
- Cost optimizations MUST preserve required reliability, security, and model-quality constraints.
- Major capacity commitments MUST use utilization and demand evidence.

## MUST NOT
- Idle accelerator capacity MUST NOT be accepted indefinitely without documented operational justification.
- Cost savings MUST NOT be reported without including material shifted or hidden costs.

## SHOULD
- Teams SHOULD expose cost-per-training-run and cost-per-inference-unit where decision-useful.

## Exceptions
Strategic excess capacity requires owner, rationale, horizon, and review date.

## Verification
Inspect billing allocation, quota enforcement, utilization, forecasts, unit economics, and optimization measurements.