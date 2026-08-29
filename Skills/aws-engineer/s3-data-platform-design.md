# S3 Data Platform Design

## Purpose
Design secure, durable, cost-efficient S3 storage for application, analytics, backup, and archival workloads.

## When to use
Use for new buckets, shared data lakes, object lifecycle design, replication, access reviews, or high S3 spend.

## Inputs
Object size/count, access patterns, retention, durability/RPO, consumers, compliance, regions, lifecycle needs.

## Context to inspect
Bucket policies, IAM, Block Public Access, object ownership, versioning, lifecycle rules, replication, KMS, access logs, inventory.

## Core knowledge
S3 is strongly consistent for object operations, but application-level concurrency still matters. Bucket policies and IAM interact. Versioning, Object Lock, replication, and lifecycle each change recovery/cost characteristics.

## Procedure
1. Classify datasets and owners.
2. Define bucket/account boundaries.
3. Block public access unless public hosting is an explicit requirement.
4. Select encryption and key model.
5. Enable versioning or Object Lock when recovery/immutability requires it.
6. Design lifecycle tiers based on measured access.
7. Configure replication only for explicit resilience or locality goals.
8. Scope access with prefixes/access points where appropriate.
9. Enable inventory and access visibility.
10. Test restore, deletion, and cross-account paths.

## Decision points
Use separate buckets/accounts for strong trust separation; use access points for complex multi-consumer policy. Avoid premature Glacier transitions for frequently recalled data.

## Common failure patterns
Public buckets, unbounded version storage, lifecycle deleting required evidence, cross-account ownership surprises, and treating replication as backup.

## Verification
Confirm policy tests, object recovery, lifecycle simulations, encryption, and cost estimates.

## Expected output
Storage architecture, policies, lifecycle strategy, and recovery plan.

## Stop conditions
Escalate if retention/legal hold requirements are ambiguous or a lifecycle rule can irreversibly delete required data.