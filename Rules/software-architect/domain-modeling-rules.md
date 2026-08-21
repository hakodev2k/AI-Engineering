# Domain Modeling Rules

## Purpose
Keep software structure aligned with business meaning and ownership where domain complexity justifies modeling.

## Scope
Applies to domain concepts, bounded contexts, aggregates, domain services, and business invariants.

## MUST
- Domain boundaries MUST reflect distinct business responsibilities, terminology, and change ownership.
- Critical business invariants MUST have a single authoritative enforcement point.
- Domain concepts exposed across boundaries MUST use explicit contracts and translation where semantics differ.
- Modeling choices MUST be proportionate to actual domain complexity.

## MUST NOT
- MUST NOT force DDD patterns into simple CRUD domains without demonstrated value.
- MUST NOT let persistence schemas define domain boundaries by default.
- MUST NOT duplicate the same business rule across multiple modules without an explicit consistency strategy.

## SHOULD
- Prefer ubiquitous terminology shared with domain stakeholders.
- Prefer explicit anti-corruption boundaries when integrating with models that use materially different semantics.

## Exceptions
Simplified models are acceptable when business complexity is low and the trade-off is documented.

## Verification
Review domain tests, business rules, context maps, contracts, naming, and change ownership.