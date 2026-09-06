# Entity Key Rules

## Purpose
Ensure feature values are joined to the correct business entities across training and serving paths.

## Scope
Entity identifiers, composite keys, namespaces, key normalization, and relationship mapping.

## MUST
- Every feature view MUST declare the entity key or composite key used to identify values.
- Key normalization MUST be deterministic across offline and online paths.
- Composite-key ordering and null behavior MUST be defined and tested.
- Entity identifiers MUST be stable enough for the feature retention and serving lifecycle.
- Cross-domain entity mappings MUST have an accountable owner and documented source of truth.

## MUST NOT
- MUST NOT infer entity identity from ambiguous display attributes.
- MUST NOT change key semantics without migration and compatibility analysis.
- MUST NOT join on lossy transformations unless explicitly validated.

## SHOULD
- Prefer canonical identifiers over repeated ad hoc mapping logic.
- Keep mapping logic versioned with the feature definition.

## Exceptions
Exceptions require documented ambiguity controls, test evidence, and owner approval.

## Verification
Review key schemas, join tests, collision tests, mapping lineage, and sample reconciliation results.