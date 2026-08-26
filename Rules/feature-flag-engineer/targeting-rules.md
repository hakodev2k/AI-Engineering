# Targeting Rules

## Purpose
Make audience targeting predictable, explainable, privacy-aware, and reversible.

## Scope
Rules based on identity, account, cohort, geography, device, environment, or attributes.

## MUST
- Targeting predicates MUST use documented, stable attributes with defined semantics.
- Precedence between overlapping rules MUST be deterministic.
- Sensitive attributes MUST be minimized and handled under applicable privacy requirements.
- High-impact targeting changes MUST be previewed against representative cohorts before activation.

## MUST NOT
- Targeting MUST NOT rely on undocumented attribute coercion or ambiguous null handling.
- Production targeting MUST NOT use sensitive personal data without legitimate purpose and approval.
- Rules MUST NOT accidentally cross tenant boundaries.

## SHOULD
- Targeting SHOULD favor simple composable predicates over deeply nested logic.
- Operators SHOULD be able to explain why a subject received a variant.

## Exceptions
Complex targeting requires documented necessity, test cases, and review.

## Verification
Use rule simulation, cohort fixtures, privacy review, tenant-isolation tests, and evaluation traces.