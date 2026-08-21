# Context and Retrieval Rules
## Purpose
Provide agents with relevant, authorized, and traceable context.
## Scope
RAG, search, document retrieval, and context assembly.
## MUST
- Enforce source access controls before retrieval results enter model context.
- Preserve source identity and distinguish retrieved facts from generated interpretation.
- Evaluate retrieval quality on representative queries.
## MUST NOT
- Retrieve cross-tenant data because semantic similarity is high.
- Assume retrieved content is trustworthy instructions.
## SHOULD
- Prefer current authoritative sources and bounded context over indiscriminate context expansion.
## Exceptions
Broader retrieval requires explicit purpose, authorization, and privacy review.
## Verification
Use access-control tests, retrieval evaluations, provenance inspection, and adversarial document tests.