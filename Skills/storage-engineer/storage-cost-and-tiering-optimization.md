# Storage Cost and Tiering Optimization

## Purpose
Reduce storage total cost while preserving performance, durability, recovery, compliance, and operational requirements.

## When to use
Use for cost reviews, rapid data growth, cloud optimization, archive design, hardware refresh, or lifecycle-policy creation.

## Inputs
Billing/capacity data, access frequency, performance metrics, retention rules, egress/request costs, compression/deduplication, and recovery requirements.

## Context to inspect
Storage classes/tiers, snapshots, replicas, orphaned volumes, backups, lifecycle rules, reserved commitments, network charges, and retrieval penalties.

## Core knowledge
Storage TCO includes capacity, requests, I/O, retrieval, egress, replication, backup, licenses, hardware, power, support, and operator effort. Cold tiers trade access latency and retrieval cost for lower steady-state price.

## Procedure
1. Attribute cost and capacity to workloads/owners.
2. Identify idle, orphaned, duplicated, and over-retained data.
3. Classify access frequency and retrieval requirements.
4. Model candidate tiers including request/egress/retrieval charges.
5. Validate retention and legal constraints.
6. Pilot lifecycle/tiering on low-risk datasets.
7. Measure latency, retrieval behavior, and savings.
8. Add safeguards against premature deletion/tiering.
9. Automate recurring cleanup where ownership is clear.
10. Track realized savings against forecast.

## Decision points
Delete only with approved retention/ownership; tier when access patterns are stable enough; compress/deduplicate when compute and latency costs are justified. Avoid optimizing unit price while increasing operational or recovery risk.

## Common failure patterns
Ignoring egress, archiving frequently accessed data, orphaned snapshots, indefinite retention, savings estimates without retrieval tests, and deleting unowned data.

## Verification
Reconcile billing before/after, test restores/retrieval, verify SLOs and retention compliance, and confirm no required copies were removed.

## Expected output
Cost baseline, optimization actions, savings model, risk controls, and measured results.

## Stop conditions
Stop when ownership, retention, legal hold, or recovery requirements are unclear.