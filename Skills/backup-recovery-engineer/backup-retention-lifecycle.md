# Backup Retention and Lifecycle Management

## Purpose
Define and enforce retention that balances recovery coverage, legal obligations, security exposure, and storage cost.

## When to use
Use when creating backup policies, changing retention, controlling storage growth, or responding to compliance requirements.

## Inputs
Recovery windows, legal/regulatory requirements, data classification, deletion obligations, backup cadence, storage tiers, and cost model.

## Context to inspect
Inspect current retention policies, legal holds, lifecycle transitions, deduplication behavior, immutable locks, archive retrieval times, and deletion evidence.

## Core knowledge
Retention must account for when loss may be discovered, not just backup frequency. Longer retention increases cost and exposure; shorter retention can eliminate recoverability. Lifecycle tiering changes restore latency.

## Procedure
1. Identify business and regulatory retention requirements.
2. Define recovery generations by workload tier.
3. Separate operational retention from archival/legal retention.
4. Map backups to storage tiers and retrieval SLAs.
5. Validate immutable retention periods.
6. Model capacity and long-term cost.
7. Configure expiration and transition policies.
8. Protect legal holds from automated deletion.
9. Monitor orphaned backups and policy drift.
10. Verify deletion after expiry where required.

## Decision points
Use grandfather-father-son style schedules only when they match actual recovery needs. Archive cold copies when retrieval time still fits recovery objectives. Avoid indefinite retention by default.

## Common failure patterns
Retention defined only in documentation; archive tier too slow for RTO; legal hold overridden by lifecycle rule; old snapshots accumulating outside policy.

## Verification
Sample backups across ages and confirm retention, immutability, tier, retrieval behavior, and expiry match policy.

## Expected output
A controlled lifecycle policy with predictable coverage, cost, and deletion behavior.

## Stop conditions
Escalate conflicting legal/deletion requirements, irreversible lock changes, or retention reductions that remove approved recovery coverage.