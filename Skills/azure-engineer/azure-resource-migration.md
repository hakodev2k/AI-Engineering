# Azure Resource Migration

## Purpose
Plan and execute migrations into or within Azure while controlling compatibility, downtime, data integrity, security, and rollback risk.

## When to use
Use for datacenter-to-Azure migrations, subscription/tenant moves, platform modernization, region moves, or service rehosting/replatforming.

## Inputs
Source inventory, dependencies, data volumes, downtime tolerance, target architecture, compliance, licensing, and business cutover constraints.

## Context to inspect
Inspect dependency maps, Azure Migrate assessments, network connectivity, identities, DNS, certificates, databases, storage, target quotas, backups, and operational tooling.

## Core knowledge
Migration strategy can include rehost, replatform, refactor, replace, retain, or retire. The safest technical migration can still fail if dependencies, operational ownership, DNS, identity, or rollback are ignored.

## Procedure
1. Inventory workloads and owners.
2. Discover runtime, data, network, identity, and external dependencies.
3. Classify each workload migration strategy.
4. Validate target service compatibility, quotas, and region availability.
5. Establish connectivity, identity, security, monitoring, and backups before cutover.
6. Define data synchronization and consistency approach.
7. Rehearse migration with representative workload/data where possible.
8. Define cutover sequence, freeze rules, rollback criteria, and communications.
9. Execute with checkpoints and evidence.
10. Validate business transactions, performance, security, and operations before decommissioning source systems.

## Decision points
Rehost when speed and low change dominate; replatform when managed services provide clear operational value with manageable compatibility change; refactor only when business benefit justifies delivery risk.

## Common failure patterns
Server inventory without dependency discovery, no rollback threshold, DNS TTL ignored, target quotas discovered during cutover, security added after migration, and decommissioning before recovery confidence.

## Verification
Compare data integrity, execute business smoke tests, validate telemetry and backups, measure performance, and confirm rollback remains available until acceptance.

## Expected output
A phased migration plan and executed cutover with dependency mapping, validation evidence, rollback criteria, and decommissioning gates.

## Stop conditions
Stop when critical dependencies are unknown, target capacity is unavailable, data-consistency strategy is unresolved, or rollback cannot meet business risk requirements.