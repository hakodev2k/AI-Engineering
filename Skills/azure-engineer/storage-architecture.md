# Azure Storage Architecture

## Purpose
Choose and configure Azure Storage services for durability, performance, access control, lifecycle, and cost requirements.

## When to use
Use for blobs, files, queues, tables, data lakes, backups, static assets, or storage performance/security reviews.

## Inputs
Data type, size, access pattern, throughput, latency, retention, replication, compliance, recovery, and consumer identities.

## Context to inspect
Inspect storage accounts, redundancy, containers/shares, access tiers, lifecycle policies, networking, RBAC, SAS usage, encryption, soft delete, versioning, and metrics.

## Core knowledge
Storage-account design affects limits, blast radius, networking, billing, and operational ownership. Redundancy options trade cost, regional survivability, and recovery behavior. Identity-based access is preferable to distributing account keys.

## Procedure
1. Classify data and access patterns.
2. Select the appropriate storage service and account type.
3. Estimate throughput, transaction, capacity, and object-count needs.
4. Choose redundancy based on durability and regional-recovery objectives.
5. Design account/container boundaries and naming.
6. Configure identity-based authorization and restrict shared-key access where practical.
7. Apply private networking when required.
8. Define lifecycle tiers, retention, soft delete, and versioning.
9. Configure diagnostics and cost monitoring.
10. Test performance, failover assumptions, recovery, and access denial.

## Decision points
Use separate accounts when workload isolation, limits, networking, or ownership justify them. Select geo-redundancy only when the recovery model can actually use it and data-consistency implications are understood.

## Common failure patterns
One account for unrelated critical workloads, public exposure by accident, permanent SAS tokens, account keys in applications, no lifecycle policy, and assuming replication equals backup.

## Verification
Measure representative throughput, test least-privilege access, restore deleted/versioned data, inspect lifecycle execution, and validate network restrictions.

## Expected output
A storage design with explicit service choice, redundancy, security, lifecycle, performance, and recovery behavior.

## Stop conditions
Stop when retention or data-residency requirements are unknown, destructive lifecycle policies lack approval, or recovery objectives cannot be met by the proposed redundancy.