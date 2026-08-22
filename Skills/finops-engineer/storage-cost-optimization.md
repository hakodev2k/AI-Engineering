# Storage Cost Optimization

## Purpose
Optimize object, block, file, snapshot, and backup storage costs without compromising durability, recovery, compliance, or application performance.

## When to use
Use for rapidly growing storage, old snapshots, expensive tiers, excessive provisioned capacity, or high retrieval/transaction charges.

## Inputs
Storage inventory, age/access patterns, capacity, IOPS/throughput, lifecycle rules, retention requirements, backup policy, billing data.

## Context to inspect
Inspect storage class/tier, provisioned versus consumed capacity, snapshots, replication, retrieval fees, operations, egress, minimum retention, encryption, and legal holds.

## Core knowledge
Cheaper storage tiers can increase retrieval, latency, and minimum-duration costs. Deletion must respect recovery, compliance, and application dependencies.

## Procedure
1. Rank storage categories by spend and growth.
2. Identify owners and retention requirements.
3. Analyze access frequency and performance requirements.
4. Find unattached volumes, stale snapshots, duplicate copies, and overprovisioned performance.
5. Model lifecycle/tiering alternatives including retrieval costs.
6. Validate backup and recovery implications.
7. Apply policies first to low-risk cohorts.
8. Monitor retrieval latency, errors, and restore behavior.
9. Confirm billing reduction.
10. Automate lifecycle and stale-resource detection.

## Decision points
Tier cold data when access patterns are predictable; delete only with authoritative retention evidence; retain performance headroom when storage saturation affects SLOs.

## Common failure patterns
Deleting snapshots by age alone, ignoring minimum storage duration, moving frequently accessed data to archive, optimizing primary storage while backup duplication dominates, and counting theoretical savings.

## Verification
Restore tests pass where required; application latency remains acceptable; lifecycle actions match retention policy; billing shows realized savings.

## Expected output
A storage optimization plan with retention constraints, modeled savings, risk controls, and realized results.

## Stop conditions
Stop before deletion when retention ownership, legal hold, or recovery requirements are unclear.