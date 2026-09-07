# Backup and Recovery Rules

## Purpose
Ensure data can be restored within declared recovery objectives.

## Scope
Snapshots, continuous backup, point-in-time recovery, restore, and disaster recovery.

## MUST
- RPO and RTO MUST be explicit for each critical dataset.
- Backups MUST be independent enough to survive the failures they are intended to cover.
- Restore procedures MUST be tested regularly using representative data volumes.
- Recovery verification MUST include integrity and application usability, not merely restore completion.

## MUST NOT
- MUST NOT claim recoverability based only on successful backup jobs.
- MUST NOT store all recovery copies in one failure or administrative domain.
- MUST NOT delete recovery points destructively without policy and approval.

## SHOULD
- Recovery exercises SHOULD include accidental deletion, corruption, and regional failure scenarios.

## Exceptions
Reduced protection requires documented business acceptance and compensating controls.

## Verification
Review backup inventories, restore drills, RPO/RTO measurements, checksum/integrity tests, and access controls.