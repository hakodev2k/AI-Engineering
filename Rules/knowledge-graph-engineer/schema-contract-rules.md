# Schema Contract Rules

## Purpose
Protect graph consumers from accidental structural and semantic breakage.

## Scope
Node labels, edge types, RDF shapes, property types, required fields, cardinality, and public graph contracts.

## MUST
- Production graph schemas MUST define required properties, cardinality, allowed relationship directions, and type constraints where applicable.
- Contract changes MUST be classified as compatible or breaking before deployment.
- Breaking changes MUST include migration, validation, and consumer cutover plans.
- Schema enforcement mechanisms MUST align with actual production invariants.

## MUST NOT
- MUST NOT silently change property meaning or units while retaining the same contract name.
- MUST NOT weaken constraints solely to allow malformed ingestion.
- MUST NOT remove graph fields or relationship types without consumer-impact evidence.

## SHOULD
- Represent enforceable constraints in machine-readable validation rules.
- Version externally consumed graph contracts.

## Exceptions
Exceptions require risk, rationale, migration evidence, and approval.

## Verification
Inspect schema diffs, contract tests, validation rules, and downstream compatibility checks.