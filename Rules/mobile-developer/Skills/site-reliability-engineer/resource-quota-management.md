# Resource and Quota Management

## Purpose
Prevent reliability incidents caused by hard platform limits, exhausted pools, regional quotas, and hidden shared-resource ceilings.

## When to use
Use before traffic growth, regional expansion, failover exercises, large migrations, or when incidents involve connection, API, storage, compute, or account-level limits.

## Inputs
Platform quotas, service limits, resource utilization, growth forecasts, failover requirements, autoscaling settings, dependency quotas, and incident history.

## Preconditions
Critical resources and the accounts, regions, subscriptions, clusters, or tenants containing them must be known.

## Context to inspect
Compute quotas, IPs, storage capacity/IOPS, database connections, message broker limits, API rate limits, certificate/secret limits, worker pools, file descriptors, ports, cloud service quotas, and third-party contracts.

## Core knowledge
Many limits are discrete hard ceilings rather than gradual saturation signals. Autoscaling cannot help when an account or dependency quota is exhausted. Failover may require enough spare quota to carry another region’s traffic, making normal-state utilization an incomplete safety measure.

## Procedure
1. Inventory hard and soft limits for critical service paths.
2. Identify limits with high utilization or slow increase processes.
3. Map each quota to expected peak and failover demand.
4. Add monitoring for utilization and remaining headroom.
5. Define warning thresholds based on lead time to exhaustion.
6. Request quota increases before capacity becomes urgent.
7. Test autoscaling against real account and regional ceilings.
8. Validate secondary-region quotas during DR exercises.
9. Review shared pools for noisy-neighbor risk.
10. Document fallback actions when quota increases are unavailable.
11. Reassess limits after architecture or provider changes.

## Decision points
Pre-allocate scarce resources when provisioning lead time is long. Partition workloads when shared limits create correlated failure. Prefer architectural reduction of resource demand when higher quotas merely postpone an unstable growth curve.

## Common failure patterns
Monitoring utilization but not hard limits, discovering quotas during an outage, assuming secondary regions have identical capacity, unlimited client concurrency, and relying on emergency provider escalation as the primary plan.

## Verification
Demonstrate expected peak and failover workloads fit within quotas with agreed headroom, alerts fire before exhaustion, and quota increase/fallback procedures are documented and tested where feasible.

## Expected output
Quota inventory, headroom model, monitoring, escalation lead times, and remediation or capacity plans.

## Stop conditions
Escalate when required limits cannot be increased, projected demand exceeds provider ceilings, or meeting reliability objectives requires material cost or architectural change.