# Semantic Definition Rules

## Purpose
Ensure contracted data has stable and reviewable business meaning.

## Scope
Applies to fields, entities, metrics, dimensions, statuses, timestamps, and enumerations exposed to consumers.

## MUST
- Contracted fields MUST define business meaning and interpretation where ambiguity is possible.
- Time fields MUST specify timezone and event-time versus processing-time semantics when relevant.
- Metrics MUST define calculation and aggregation behavior.
- Semantic changes MUST receive the same review rigor as structural contract changes.

## MUST NOT
- A field MUST NOT reuse an existing name for a materially different business concept.
- Ambiguous terms MUST NOT remain undefined when multiple interpretations are plausible.
- Documentation MUST NOT claim semantics that differ from production transformation logic.

## SHOULD
- Definitions SHOULD use governed domain terminology where available.
- Examples SHOULD cover boundary cases that commonly cause misinterpretation.

## Exceptions
Exceptions require documented ambiguity, consumer risk, mitigation, and owner approval.

## Verification
Review contract documentation against domain definitions, sample records, transformation logic, and consumer usage. Require semantic review for changes that alter interpretation without changing structure.