# Lineage and Provenance Rules

## Purpose
Make every production feature traceable from source data through transformation to consumers.

## Scope
Source datasets, transformations, jobs, feature versions, materializations, models, and downstream consumers.

## MUST
- Production features MUST identify authoritative sources and transformation versions.
- Materialized values MUST be attributable to the producing job or pipeline version.
- Lineage MUST capture downstream model or application consumers where practical.
- Ownership changes MUST preserve historical accountability.
- Incident investigation MUST be able to determine which feature versions affected a consumer.

## MUST NOT
- MUST NOT publish production features with unknown source provenance.
- MUST NOT delete lineage needed for active audit, incident, or compliance requirements.
- MUST NOT infer lineage solely from naming conventions when deterministic metadata can be recorded.

## SHOULD
- Automate lineage capture from orchestration and serving systems.
- Include code revision or immutable artifact identifiers where practical.

## Exceptions
Manual lineage is acceptable only with documented gaps and remediation ownership.

## Verification
Inspect catalog graphs, job metadata, code revisions, model dependencies, and incident traceability drills.