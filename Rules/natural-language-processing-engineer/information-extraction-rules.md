# Information Extraction Rules

## Purpose
Ensure extracted entities, relations, events, and spans have explicit semantics and reliable boundaries.

## Scope
NER, relation extraction, event extraction, slot filling, span mapping, and structured output.

## MUST
- Extraction schemas MUST define entity/relation semantics, overlap rules, nesting, boundary policy, and null/unknown behavior.
- Structured outputs MUST be schema-validated before downstream use.
- Span outputs MUST preserve reliable mapping to source text when traceability is required.
- Evaluation MUST include boundary errors and class-specific precision/recall.

## MUST NOT
- MUST NOT invent missing source facts to satisfy a schema.
- MUST NOT collapse unknown, absent, and extraction-failed states when downstream behavior differs.
- MUST NOT silently discard overlapping or nested entities if the task contract permits them.

## SHOULD
- Systems SHOULD expose confidence or provenance where downstream consumers can use it safely.
- Critical extracted facts SHOULD be traceable to source evidence.

## Exceptions
Lossy transformations require documented consumer requirements, measured impact, and compatibility review.

## Verification
Use schema tests, span round-trip tests, per-class metrics, adversarial boundary cases, source-provenance checks, and integration tests with downstream consumers.