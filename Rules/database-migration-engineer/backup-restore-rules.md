# Backup and Restore

## Purpose
Ensure recoverable protection exists before migration risk is introduced.

## Scope
Covers snapshots, backups, point-in-time recovery, restore targets, and retention.

## MUST
- Required backups MUST complete before destructive or irreversible migration phases.
- Restore procedures MUST be tested against a representative target and measured against recovery objectives.
- Backup scope MUST include all state required for coherent recovery, including dependent metadata where necessary.

## MUST NOT
- MUST NOT equate backup completion with recoverability.
- MUST NOT delete the last known-good recovery artifact before migration acceptance and retention criteria are met.

## SHOULD
- Prefer point-in-time recovery where it materially reduces data-loss exposure.
- Record restore dependencies, encryption keys, and operational prerequisites without exposing secrets.

## Exceptions
Proceeding without a fresh backup requires evidence that another tested recovery mechanism provides equivalent protection and explicit approval.

## Verification
Review backup timestamps, restore drill results, recovery-point tests, retention configuration, dependency inventories, and approvals.