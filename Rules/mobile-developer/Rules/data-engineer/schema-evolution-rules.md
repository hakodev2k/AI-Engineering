# Schema Evolution Rules
## Purpose
Protect downstream compatibility as data structures change.
## Scope
Tables, events, files, lakehouse schemas, and published datasets.
## MUST
- Schema changes MUST classify compatibility and identify affected consumers.
- Breaking changes MUST have a migration and rollout plan.
- Renames, type changes, and semantic changes MUST preserve or explicitly migrate historical interpretation.
## MUST NOT
- MUST NOT drop or repurpose fields used by consumers without verified migration.
- MUST NOT infer compatibility from successful deployment alone.
## SHOULD
- Prefer additive evolution and deprecation windows.
## Exceptions
Coordinated breaking changes require documented impact and approval.
## Verification
Use schema diffing, consumer tests, lineage, migration tests, and release evidence.