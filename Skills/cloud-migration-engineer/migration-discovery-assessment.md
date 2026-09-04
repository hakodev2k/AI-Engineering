# Migration Discovery and Assessment

## Purpose
Build an evidence-based inventory and migration assessment before changing workloads. This prevents plans based on incomplete application, dependency, ownership, or operational assumptions.

## When to use
Use at the start of a cloud migration, after acquisitions, or when an inherited estate lacks reliable documentation. Do not use inventory alone as a migration plan.

## Inputs
Repository and service catalog access, infrastructure inventory, CMDB or asset data, traffic/dependency telemetry, cost data, compliance constraints, business owners, incident history, and lifecycle dates.

## Preconditions
Confirm assessment scope, environments, data sensitivity boundaries, and read permissions. Identify authoritative sources and known blind spots.

## Context to inspect
Inspect runtime topology, DNS, load balancers, databases, queues, storage, certificates, identity dependencies, scheduled jobs, third-party integrations, deployment pipelines, backups, monitoring, licensing, and support ownership.

## Core knowledge
Discovery must distinguish observed dependencies from documented ones. A migration unit is usually a business capability plus its runtime/data dependencies, not a single VM. Capture criticality, RTO/RPO, latency sensitivity, regulatory constraints, unsupported software, and technical debt.

## Procedure
1. Define estate boundaries and assessment taxonomy.
2. Reconcile inventories from cloud, virtualization, network, CMDB, repositories, and billing sources.
3. Map applications to owners and business capabilities.
4. Observe inbound, outbound, data, identity, and operational dependencies.
5. Classify environments and criticality.
6. Record runtime versions, support status, licensing, and capacity.
7. Establish utilization baselines and seasonality.
8. Identify data stores and sensitivity classifications.
9. Capture availability, RTO/RPO, maintenance, and deployment constraints.
10. Record unknowns explicitly and assign evidence-gathering actions.
11. Group components into migration units.
12. Review findings with technical and business owners.
13. Produce an assessment with confidence levels rather than false precision.

## Decision points
Use automated discovery when the estate is large or documentation is weak; supplement it with interviews and traffic evidence. Treat undocumented traffic as a dependency until disproved. Split migration units only when contracts and operational independence are demonstrated.

## Common failure patterns
Relying on CMDB alone; ignoring batch jobs; missing outbound allowlists; overlooking certificate or DNS dependencies; treating low CPU as low business criticality; omitting non-production environments; failing to record owners; assuming inactive-looking systems are disposable.

## Verification
Reconcile discovered assets against at least two independent sources where practical. Validate dependency maps with telemetry and owners. Sample migration units end-to-end. Confirm every critical workload has an owner, classification, dependency map, and unresolved-risk list.

## Expected output
A validated estate inventory, dependency map, migration-unit catalog, criticality classification, baseline metrics, and explicit unknowns with confidence levels.

## Stop conditions
Stop and escalate when discovery requires prohibited production access, ownership cannot be established for critical systems, regulated data classification is unresolved, or evidence materially contradicts the proposed scope.