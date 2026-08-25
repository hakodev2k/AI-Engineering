# Storage Tiering, Lifecycle, and Cost

## Purpose
Place data on appropriate storage tiers and automate lifecycle transitions while preserving retrieval SLOs, compliance, durability, and predictable cost.

## When to use
Use for cost optimization, archive design, data-growth control, or tier-policy review.

## Inputs
Access frequency, object/file age, retrieval latency, retention, deletion rules, capacity, request/egress costs, and compliance constraints.

## Preconditions
Classify data by business value and recovery/retrieval requirements before changing placement.

## Context to inspect
Current tiers, lifecycle policies, access telemetry, minimum-duration charges, retrieval fees, replication, backups, legal holds, and application assumptions.

## Core knowledge
Cheaper capacity can impose retrieval delay, transaction fees, minimum retention, reduced performance, or operational complexity. Lifecycle optimization must consider total cost and access behavior, not price per GB alone.

## Procedure
1. Segment data by age, access, criticality, and retention.
2. Measure real access frequency and retrieval patterns.
3. Map candidate tiers to SLOs.
4. Model capacity, requests, retrieval, egress, and operations cost.
5. Define transition and expiration rules.
6. Protect legal/immutable data from accidental expiry.
7. Test retrieval from cold tiers.
8. Roll out gradually and monitor misses/retrieval costs.
9. Revisit policies as access patterns change.

## Decision points
Automate transitions for stable patterns; keep hot data where latency and retrieval economics justify it. Archive only when restore time is acceptable.

## Common failure patterns
Deleting legally retained data, archiving frequently accessed data, ignoring retrieval/egress fees, lifecycle rules conflicting with backups, and no cold-tier restore test.

## Verification
Cost model matches billing telemetry, lifecycle transitions occur as designed, and retrieval tests meet stated objectives.

## Expected output
A tiering/lifecycle policy with eligibility, economics, safeguards, retrieval evidence, and review cadence.

## Stop conditions
Stop when retention/legal requirements are ambiguous or lifecycle changes could irreversibly delete data without approved protection.
