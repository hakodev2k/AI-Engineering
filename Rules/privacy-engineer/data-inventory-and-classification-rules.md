# Data Inventory and Classification Rules

## Purpose
Maintain reliable knowledge of personal data and its sensitivity across systems.

## Scope
Databases, files, logs, telemetry, APIs, queues, caches, backups, SaaS platforms, and data pipelines.

## MUST
- Personal-data stores and flows MUST have accountable owners.
- Data inventories MUST identify source, purpose, sensitivity, recipients, retention, residency, and system of record where relevant.
- Classification MUST distinguish ordinary personal data from sensitive or highly regulated categories.
- Inventory records MUST be updated when material processing changes.
- Unknown or unclassified repositories containing personal data MUST be investigated and remediated.

## MUST NOT
- MUST NOT rely only on application documentation when runtime stores or replicas may differ.
- MUST NOT classify data solely by field names without considering semantics and combinations.

## SHOULD
- Automated discovery SHOULD supplement owner attestations.
- Inventories SHOULD link to retention, access, lineage, and deletion controls.

## Exceptions
Temporary unknowns require an owner, bounded investigation window, risk treatment, and documented resolution.

## Verification
Compare inventories with schemas, data catalogs, storage scans, telemetry, integration manifests, and architecture diagrams.