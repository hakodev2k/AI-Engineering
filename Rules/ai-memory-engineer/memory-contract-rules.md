# Memory Contract Rules

## Purpose
Make stored memories explicit, interpretable, and compatible across producers and consumers.

## Scope
Memory schemas, identifiers, confidence, provenance, timestamps, versioning, and semantic meaning.

## MUST
- Every persisted memory type MUST define schema, meaning, owner, provenance fields, and validity semantics.
- Consumer-visible schema changes MUST be classified as compatible or breaking.
- Memories that encode inference MUST distinguish inferred content from observed facts.
- Confidence or uncertainty metadata MUST have documented interpretation when used for decisions.

## MUST NOT
- MUST NOT silently change the meaning of an existing memory field.
- MUST NOT represent uncertain inferences as verified facts.
- MUST NOT rely on undocumented default values for safety-relevant memory fields.

## SHOULD
- Contracts SHOULD be machine-readable and validated in CI.
- Deprecated memory fields SHOULD include migration guidance and sunset criteria.

## Exceptions
Exceptions require rationale, compatibility analysis, migration evidence, and owner approval.

## Verification
Inspect schemas, contract tests, serialization tests, migration tests, and consumer compatibility checks.