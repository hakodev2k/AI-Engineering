# Migration to GCP

## Purpose
Plan and execute workload migration to Google Cloud with controlled risk, tested cutover, data integrity, and rollback.

## When to use
Use for datacenter exit, cloud-to-cloud migration, platform modernization, or managed-service adoption.

## Inputs
Application inventory, dependencies, data stores, traffic, compliance, downtime tolerance, RTO/RPO, and target-state goals.

## Context to inspect
Current topology, latency dependencies, authentication, DNS, certificates, network connectivity, database size/change rate, deployment process, and observability.

## Core knowledge
Migration strategy should distinguish rehost, replatform, refactor, retire, retain, and replace. Data movement and hidden dependencies usually dominate migration risk.

## Procedure
1. Inventory applications and dependency graph.
2. Define target-state architecture and migration rationale.
3. Group workloads into migration waves.
4. Establish secure connectivity and identity first.
5. Choose data migration and synchronization method.
6. Define acceptance criteria and rollback point.
7. Rehearse cutover with representative load.
8. Execute change freeze and final synchronization.
9. Shift traffic gradually where possible.
10. Validate business transactions before decommissioning source.

## Decision points
Rehost only when speed outweighs optimization. Replatform when managed services reduce operations without unacceptable redesign risk.

## Common failure patterns
Migrating unknown dependencies, DNS TTL surprises, no rollback, underestimating data sync, and decommissioning too early.

## Verification
Run functional, performance, security, reconciliation, and rollback tests; compare source/target data where applicable.

## Expected output
A wave-based migration plan with proven cutover and rollback.

## Stop conditions
Stop if source backups, rollback, or critical dependency ownership is missing.