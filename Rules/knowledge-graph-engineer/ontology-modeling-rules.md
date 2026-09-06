# Ontology Modeling Rules

## Purpose
Keep domain semantics explicit, stable, reviewable, and reusable across graph consumers.

## Scope
Classes, concepts, predicates, relationships, constraints, taxonomies, and semantic boundaries.

## MUST
- Every production concept MUST have a documented meaning, owner, and intended scope.
- Modeling decisions MUST distinguish identity, classification, composition, containment, and association semantics.
- Domain concepts MUST be defined independently from a single application screen or query shape.
- Material ontology changes MUST identify affected data mappings and consumers.

## MUST NOT
- MUST NOT encode contradictory meanings under the same class or predicate.
- MUST NOT create duplicate concepts for the same domain meaning without an explicit compatibility reason.
- MUST NOT overload one relationship with materially different semantics across contexts.

## SHOULD
- Prefer the smallest ontology that represents required business meaning precisely.
- Reuse established vocabularies when their semantics are compatible.

## Exceptions
Exceptions require rationale, alternatives considered, affected consumers, and owner approval.

## Verification
Inspect ontology diffs, competency questions, validation constraints, and consumer-impact evidence.