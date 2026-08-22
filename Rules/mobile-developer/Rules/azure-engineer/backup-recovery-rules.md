# Backup and Recovery Rules

## Purpose
Ensure recoverable data and infrastructure with evidence-backed recovery objectives.

## Scope
Azure Backup, snapshots, database backups, vaults, restore procedures, RPO, RTO, and disaster recovery data protection.

## MUST
- Define RPO and RTO for critical data and services.
- Configure backup policies that align with retention and recovery requirements.
- Test restores periodically using representative recovery scenarios.
- Protect backup administration and deletion with appropriate separation and safeguards.
- Document recovery dependencies and ordering.

## MUST NOT
- Treat successful backup jobs as proof that recovery works.
- Delete recovery points or weaken retention without approved impact assessment.
- Store the only recovery procedure inside the system it is intended to recover.

## SHOULD
- Automate backup compliance reporting and restore validation where feasible.

## Exceptions
Backup exclusions require data classification, business justification, risk acceptance, and owner.

## Verification
Inspect backup policies, protected items, retention, restore-test evidence, RPO/RTO records, permissions, and recovery runbooks.