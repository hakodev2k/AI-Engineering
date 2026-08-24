# Data Locality and Residency
## Purpose
Keep data processing and movement within required geographic, contractual, and privacy boundaries.
## Scope
Collection, processing, caching, replication, and export at edge locations.
## MUST
- Data classes MUST have documented allowed processing and storage locations before deployment.
- Replication routes MUST respect residency and retention constraints.
- Sensitive data movement MUST be minimized and auditable.
## MUST NOT
- MUST NOT replicate regulated or restricted data to an unapproved region or provider.
- MUST NOT infer residency compliance from physical proximity alone.
## SHOULD
- Processing SHOULD occur near the data source when it reduces unnecessary sensitive-data transfer.
## Exceptions
Exceptions require legal/security review where applicable, documented scope, controls, and approval.
## Verification
Inspect data-flow diagrams, configuration, storage locations, network destinations, retention settings, and audit evidence.