# Disaster Recovery and Failover

## Purpose
Design and validate recovery for region, cluster, broker, and storage failures while preserving explicitly defined RPO and RTO targets.

## When to use
Use when establishing DR, reviewing cross-region replication, preparing game days, or changing failover topology.

## Inputs
- RPO/RTO targets
- Critical destinations
- Region topology
- Replication capabilities
- DNS/client failover model
- Compliance constraints

## Context to inspect
Inspect replication lag, destination configuration parity, client bootstrap endpoints, schema registries, credentials, network routing, and historical failover tests.

## Core knowledge
Cross-region messaging involves latency, asynchronous replication gaps, duplicate delivery, ordering changes, split-brain risk, metadata/schema synchronization, and client reconfiguration.

## Procedure
1. Classify destinations by recovery criticality.
2. Map dependencies required for a functional secondary region.
3. Choose active-passive or active-active intentionally.
4. Define replication scope and acceptable lag.
5. Synchronize schemas, ACLs, configuration, and secrets safely.
6. Define client failover and failback procedures.
7. Document data reconciliation for duplicates, gaps, and reordering.
8. Test regional loss with representative producers and consumers.
9. Measure actual RPO/RTO and remediation gaps.

## Decision points
Prefer active-passive when consistency and operational simplicity dominate. Use active-active only when applications tolerate conflict, duplicate, and ordering complexity.

## Common failure patterns
- Replicating data but not schemas or ACLs
- Untested client bootstrap failover
- Assuming zero RPO with asynchronous replication
- Failback procedure omitted
- Recovery region under-provisioned

## Verification
Run controlled failover and failback, validate end-to-end message flow, measure replication gap, verify permissions, and reconcile data according to policy.

## Expected output
A tested DR design with RPO/RTO evidence, failover/failback runbooks, and reconciliation rules.

## Stop conditions
Stop when recovery objectives are undefined, secondary capacity is insufficient, or failover could cause uncontrolled split-brain or data loss.