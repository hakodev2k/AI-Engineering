# Schema and Data Contract Rules
## Purpose
Prevent uncontrolled semantic and structural breakage between data producers and consumers.
## Scope
Schemas, events, files, tables, APIs, and data-product contracts.
## MUST
- Shared contracts MUST define fields, types, semantics, ownership, compatibility expectations, and quality obligations.
- Breaking changes MUST identify affected consumers and follow an approved migration or versioning strategy.
- Contract changes MUST be traceable to reviewed requirements.
## MUST NOT
- Producers MUST NOT silently repurpose fields or change units, meaning, nullability, or identifiers.
- Breaking public or cross-domain contracts MUST NOT execute without required approval.
## SHOULD
- Contracts SHOULD be machine-testable in CI or pipeline validation.
## Exceptions
Emergency changes require impact evidence, approval, communication, rollback/forward plan, and retrospective review.
## Verification
Inspect contract definitions, compatibility tests, change history, consumer impact analysis, and migration evidence.