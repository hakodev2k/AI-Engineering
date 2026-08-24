# Backup and Recovery Rules

## Purpose
Ensure data can be restored after corruption, deletion, ransomware, software defects, or catastrophic loss.

## Scope
Backup policy, restore procedures, retention, isolation, and recovery validation.

## MUST
- Backup scope, frequency, retention, RPO, and RTO MUST be defined by data criticality.
- Backups MUST be logically or physically isolated from the primary failure and administrative domain when required by threat models.
- Restore procedures MUST be tested on a defined cadence using representative data.
- Recovery tests MUST verify data usability, not merely backup job completion.
- Backup failures MUST alert an accountable owner.

## MUST NOT
- MUST NOT treat snapshots or replicas as sufficient backups unless they independently satisfy deletion, corruption, and compromise scenarios.
- MUST NOT delete the last known recoverable copy without approved retention handling.

## SHOULD
- Prefer immutable or protected backup copies for high-impact data.

## Exceptions
Exceptions require documented business acceptance, compensating controls, and a review date.

## Verification
Inspect backup inventories, job history, isolation controls, restore-test evidence, achieved RPO/RTO, and failure alerts.