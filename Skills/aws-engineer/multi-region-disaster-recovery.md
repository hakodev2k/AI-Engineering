# Multi-Region Disaster Recovery

## Purpose
Design and validate AWS disaster recovery that meets explicit RPO/RTO through tested failover and data-recovery procedures.

## When to use
Use for critical systems requiring regional recovery, resilience reviews, regulatory continuity, or DR test planning.

## Inputs
RPO, RTO, dependency map, stateful services, DNS, secrets, data replication, compliance, recovery staffing.

## Context to inspect
Backup replication, database replicas/global databases, S3 replication, Route 53, IaC, KMS multi-region considerations, quotas, external dependencies.

## Core knowledge
Multi-region is not automatically DR. Data replication can replicate corruption. Recovery requires infrastructure, data, identity, DNS, secrets, third parties, and rehearsed procedures. Warm standby and active-active have materially different cost/complexity.

## Procedure
1. Define business RPO/RTO and acceptable degraded mode.
2. Inventory every dependency needed to serve users.
3. Choose backup/restore, pilot light, warm standby, or active-active.
4. Provision recovery infrastructure through IaC.
5. Replicate data with understood consistency and failure semantics.
6. Pre-provision quotas, certificates, secrets, and IAM.
7. Define traffic failover and failback sequence.
8. Protect backups from correlated compromise.
9. Run scheduled game days and measure actual RPO/RTO.
10. Feed findings back into architecture and runbooks.

## Decision points
Use active-active only when business value justifies consistency and operational complexity. Prefer simpler DR if objectives can be met with warm standby or pilot light.

## Common failure patterns
Untested backups, missing DNS/certificates, underestimated data lag, no failback plan, correlated credentials, and DR depending on the failed region.

## Verification
Execute end-to-end failover/failback, restore data, measure objectives, and record gaps.

## Expected output
DR architecture, dependency checklist, runbook, and test evidence.

## Stop conditions
Escalate if required RPO/RTO cannot be met with available architecture or DR testing risks uncontrolled production impact.