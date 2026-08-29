# Backup and Restore Rules

## Purpose
Ensure graph data can be recovered to agreed recovery objectives.

## Scope
Backups, snapshots, point-in-time recovery, restore testing, and disaster recovery data procedures.

## MUST
- Define RPO and RTO for production graph datasets.
- Back up data, schema/constraints, indexes or their reproducible definitions, and required configuration metadata.
- Test restores on a scheduled basis using isolated environments.
- Verify restored graph integrity, identity constraints, relationship counts, and critical queries.
- Protect backup access and encryption to at least the sensitivity of source data.

## MUST NOT
- Treat a successful backup job as proof of recoverability.
- Overwrite the only known-good recovery point during incident response.
- Perform destructive recovery actions in production without explicit human approval.

## SHOULD
- Maintain multiple recovery points and geographically appropriate copies based on risk.
- Automate restore verification where practical.

## Exceptions
Reduced recovery guarantees require documented business acceptance, data-loss impact, and compensating controls.

## Verification
Review backup success, retention, encryption, restore drill evidence, measured RPO/RTO, restored constraint metadata, reconciliation results, and critical-query validation.