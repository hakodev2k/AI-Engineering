# Storage and Data Transfer Rules

## Purpose
Control cost growth caused by data retention, replication, access patterns, and network movement.

## Scope
Object, block, file, database storage, backups, snapshots, logs, replication, CDN, inter-zone, inter-region, and egress costs.

## MUST
- Identify retention, durability, recovery, locality, access-frequency, and compliance requirements before optimization.
- Measure stored volume, growth, retrieval, replication, and transfer patterns for material datasets.
- Define lifecycle and deletion policies with accountable data owners.
- Assess restore and retrieval consequences before moving data to cheaper tiers.

## MUST NOT
- Delete data, backups, or snapshots solely for savings without approved retention and recovery validation.
- Reduce redundancy below documented resilience requirements.
- Ignore egress and cross-boundary transfer when comparing architecture options.

## SHOULD
- Place compute and data to reduce unnecessary movement when security, resilience, and latency permit.

## Exceptions
Legal hold, investigation, or incident requirements override normal lifecycle optimization when documented.

## Verification
Inspect lifecycle policies, retention approvals, restore tests, storage growth, access metrics, transfer billing, and data-owner sign-off.