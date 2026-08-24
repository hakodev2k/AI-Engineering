# Storage Cost Efficiency Rules

## Purpose
Control storage cost without sacrificing required durability, recovery, performance, or compliance.

## Scope
Tiering, lifecycle, compression, deduplication, replication overhead, egress, reserved capacity, and waste.

## MUST
- Cost optimization MUST preserve explicit service and data-protection requirements.
- Major cost decisions MUST account for total lifecycle cost, including operations, migration, egress, backup, recovery, and growth.
- Tiering and lifecycle policies MUST be validated against access and restore requirements.
- Claimed savings MUST use measured or auditable cost evidence.

## MUST NOT
- MUST NOT reduce redundancy, backups, encryption, or recovery capability solely for savings without approved risk acceptance.
- MUST NOT delete apparently unused data without ownership, retention, and dependency checks.
- MUST NOT optimize unit price while ignoring operational complexity or exit cost.

## SHOULD
- Regularly identify orphaned capacity, stale snapshots, inefficient tiers, and overprovisioned guarantees.

## Exceptions
Intentional premium spend requires documented value or risk rationale.

## Verification
Review billing/cost reports, utilization, lifecycle policies, savings calculations, protection settings, and ownership evidence.