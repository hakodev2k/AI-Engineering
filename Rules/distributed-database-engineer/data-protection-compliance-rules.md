# Data Protection and Compliance Rules

## Purpose
Ensure sensitive data remains appropriately classified, protected, retained, and auditable.

## Scope
Encryption, classification, residency, retention, deletion, masking, and regulated data handling.

## MUST
- Sensitive datasets MUST have classification, retention, residency, and access requirements identified.
- Data in transit and sensitive data at rest MUST use approved cryptographic protection.
- Deletion workflows MUST account for replicas, backups, derived stores, and legal retention obligations.
- Production data copied to lower environments MUST be minimized and protected or irreversibly de-identified.

## MUST NOT
- MUST NOT log credentials, tokens, or unnecessary sensitive record contents.
- MUST NOT move regulated data across residency boundaries without authorization.

## SHOULD
- Data minimization SHOULD be applied at collection and replication boundaries.

## Exceptions
Exceptions require security/privacy review, documented legal basis where applicable, and compensating controls.

## Verification
Review classification inventories, encryption configuration, retention jobs, deletion evidence, audit logs, and access controls.