# Data Provenance Rules

## Purpose
Make every training corpus auditable, legally usable, reproducible, and attributable to known sources and transformations.

## Scope
All datasets entering model weight updates, including synthetic, licensed, public, partner, user-derived, and internally generated data.

## MUST
- Every dataset MUST have a stable identity, version, source lineage, acquisition basis, transformation history, and accountable owner.
- Usage rights and policy constraints MUST be recorded before data enters a production training mixture.
- Derived datasets MUST preserve lineage to their upstream sources and transformation code or configuration.
- Data snapshots used by released checkpoints MUST remain reproducibly identifiable.
- Provenance gaps affecting material portions of a corpus MUST be treated as release risks.

## MUST NOT
- MUST NOT ingest data merely because it is technically accessible.
- MUST NOT erase lineage through undocumented exports, manual copies, or unversioned preprocessing.
- MUST NOT represent unknown-origin data as verified or licensed.

## SHOULD
- Provenance SHOULD be machine-queryable and integrated into dataset catalogs.
- Dataset manifests SHOULD include collection dates, languages, domains, approximate volumes, and known restrictions.

## Exceptions
Emergency research-only exceptions require isolation from release pipelines, explicit risk documentation, and approval from the responsible data owner.

## Verification
Inspect dataset manifests, licenses or usage records, lineage metadata, storage identifiers, transformation references, and reproducibility checks for sampled records.