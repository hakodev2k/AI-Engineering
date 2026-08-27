# Backup

## Purpose
Ensure backups provide usable recovery capability rather than nominal job success.

## Scope
Database data, transaction logs, metadata, encryption material dependencies, and configuration required for restoration.

## MUST
- Backup scope, frequency, retention, encryption, and storage location MUST align with approved recovery objectives and data classification.
- Backup failures MUST alert an accountable operator and be investigated within the defined operational window.
- Backup integrity MUST be validated through restore testing, not file existence alone.
- Backup access MUST follow least privilege and be auditable.

## MUST NOT
- MUST NOT store the only recoverable backup in the same failure domain as the primary database.
- MUST NOT expose backup media or credentials through logs, scripts, tickets, or source control.
- MUST NOT delete recovery points needed to satisfy retention or incident-preservation requirements without approval.

## SHOULD
- Immutable or otherwise tamper-resistant copies SHOULD protect critical recovery points.
- Backup capacity and duration SHOULD be trended.

## Exceptions
Any deviation requires documented risk, recovery impact, compensating controls, owner, expiry, and approval.

## Verification
Inspect backup histories, alerting, retention, access controls, encryption configuration, restore-test evidence, and recovery-point inventory.