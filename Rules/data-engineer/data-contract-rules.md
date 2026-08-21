# Data Contract Rules
## Purpose
Protect producer-consumer compatibility and meaning.
## Scope
Schemas, events, files, tables, and APIs used as data interfaces.
## MUST
- Define owner, schema, semantics, nullability, keys, freshness, and compatibility expectations for governed contracts.
- Validate contract changes before release and classify breaking changes explicitly.
- Version or coordinate incompatible changes with affected consumers.
## MUST NOT
- Repurpose an existing field with different semantics without an approved migration.
- Treat undocumented producer behavior as a stable contract.
## SHOULD
- Automate schema and compatibility checks in CI where practical.
## Exceptions
Exceptions require affected consumers, risk, migration plan, evidence, and approval.
## Verification
Inspect contract definitions, compatibility tests, lineage, release evidence, and consumer impact review.