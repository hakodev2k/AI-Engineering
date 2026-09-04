# Data Lineage and Inventory Rules

## Purpose
Maintain reliable knowledge of where personal data originates, flows, transforms, and persists.

## Scope
Applies to source systems, ingestion pipelines, APIs, queues, databases, warehouses, indexes, exports, backups, and derived datasets.

## MUST
- Material personal-data flows MUST have an identifiable source, owner, destination, processing purpose, and retention path.
- Lineage MUST include material transformations and copies that affect privacy classification or deletion obligations.
- New persistent stores or integrations containing personal data MUST be added to the inventory before production release.
- Ownership changes MUST update inventory accountability.
- Unknown personal-data stores discovered in production MUST be investigated and classified promptly.

## MUST NOT
- Data inventories MUST NOT rely solely on stale architecture diagrams when runtime evidence is available.
- Derived datasets MUST NOT be omitted because they are generated rather than directly collected.
- Temporary exports MUST NOT be treated as outside governance solely because they are short-lived.

## SHOULD
- Inventory and lineage SHOULD be generated from schemas, infrastructure, catalogs, and runtime telemetry where practical.
- Critical flows SHOULD have automated drift detection.

## Exceptions
Exceptions require documented scope, temporary controls, owner, resolution date, and approval when inventory gaps create material risk.

## Verification
Compare inventories against schemas, infrastructure, storage listings, network flows, pipeline definitions, and sampled runtime traces. Investigate unmatched stores or transfers.