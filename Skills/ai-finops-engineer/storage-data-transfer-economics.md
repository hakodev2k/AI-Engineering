# Storage and Data Transfer Economics

## Purpose
Optimize the non-compute cost of AI systems, especially datasets, checkpoints, embeddings, model artifacts, logs, and cross-region/provider data movement.

## When to use
Use when storage or network charges are growing, training data is duplicated, checkpoints accumulate, or multi-region/multi-cloud designs create significant transfer cost.

## Inputs
- Storage inventory and growth
- Access frequency and retention rules
- Data transfer volumes and paths
- Storage-tier pricing
- Egress/inter-region pricing
- Compliance and recovery requirements

## Context to inspect
Inspect dataset copies, checkpoint cadence, model registries, object lifecycle rules, vector indexes, observability retention, cross-region replication, and provider boundaries.

## Core knowledge
AI platforms often create large secondary data footprints. The cheapest storage tier is not cheapest if retrieval, egress, latency, or minimum-duration charges dominate. Data locality can materially affect total training and inference economics.

## Procedure
1. Inventory major data classes and owners.
2. Measure size, growth, access frequency, and retention.
3. Trace high-volume data movement paths.
4. Quantify storage, request, retrieval, and transfer costs separately.
5. Identify duplicate or obsolete datasets and artifacts.
6. Apply lifecycle tiers consistent with access patterns.
7. Co-locate compute and data where economically and operationally sensible.
8. Reduce unnecessary cross-region/provider transfers.
9. Tune checkpoint retention and compression policies.
10. Validate recovery, compliance, and latency before deleting or tiering.
11. Measure realized savings after the billing cycle.

## Decision points
Use colder tiers for infrequent access when retrieval economics fit. Replicate data when performance/reliability value exceeds transfer and duplicate-storage cost. Keep compliance-required copies regardless of nominal savings.

## Common failure patterns
Ignoring retrieval fees, moving data across clouds for small compute discounts, indefinite checkpoint retention, and deleting data without reproducibility or legal review.

## Verification
Reconcile storage and network usage before/after, test retrieval/recovery, and confirm workload latency and availability remain acceptable.

## Expected output
A storage/data-movement cost map, lifecycle policy, locality recommendations, and verified savings.

## Stop conditions
Stop when retention or residency requirements are unclear, data lineage is missing, or proposed movement/deletion risks model reproducibility or recovery.