# Naming Consistency Rules

## Purpose
Keep API vocabulary predictable across domains without sacrificing correct domain terminology.

## Scope
Applies to resource names, fields, operations, parameters, events, and error identifiers.

## MUST
- Names MUST use the canonical business term for the concept they represent.
- Equivalent concepts across the same API surface MUST use consistent names and casing conventions.
- Acronyms, abbreviations, units, dates, and identifiers MUST follow documented portfolio conventions.
- Renaming a public field or operation MUST be treated as a compatibility change.
- Ambiguous terms MUST be resolved before contract approval.

## MUST NOT
- Different names MUST NOT be used for the same concept solely because different teams implemented them.
- Internal database, queue, class, or vendor names MUST NOT leak into public contracts without a deliberate domain reason.
- Governance MUST NOT force misleading terminology merely to satisfy superficial consistency.

## SHOULD
- Shared vocabulary SHOULD be maintained for cross-cutting concepts such as identifiers, timestamps, money, locale, and pagination.
- Names SHOULD remain understandable without knowledge of implementation topology.

## Exceptions
Exceptions require documented domain meaning, conflict analysis, consumer impact, and approval.

## Verification
Use API linting, schema review, glossary comparison, and cross-API portfolio review. Verify terminology is consistent and domain-correct.