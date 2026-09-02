# Cloud Quota and Limit Management

## Purpose
Prevent capacity failures caused by provider quotas, account limits, regional scarcity, and service ceilings.

## Scope
Applies to cloud service quotas, API limits, regional capacity constraints, managed-service ceilings, and account-level allocations.

## MUST
- Capacity plans MUST inventory provider quotas and hard limits that can block scaling.
- Required quota increases MUST be requested with enough lead time for the forecast horizon and launch plan.
- Critical scaling paths MUST account for region, zone, instance family, accelerator, storage, IP, and service-specific scarcity where applicable.
- Quota consumption MUST be monitored where exhaustion can impair recovery or autoscaling.

## MUST NOT
- MUST NOT assume a configured autoscaler can provision resources beyond provider quotas.
- MUST NOT rely on undocumented or unverified provider capacity commitments.
- MUST NOT consume emergency or failover quota for routine workloads without an accepted risk decision.

## SHOULD
- Maintain alternative capacity options for constrained resource classes.
- Periodically validate quotas against architecture changes and projected peaks.

## Exceptions
Exceptions require explicit risk, compensating controls, escalation path, and accountable approval.

## Verification
Inspect provider quota dashboards, support approvals, regional capacity evidence, autoscaling failures, and quota-utilization alerts.
