# Transformation Rules

## Purpose
Keep warehouse transformations deterministic, reviewable, and semantically correct.

## Scope
Applies to SQL, ELT, transformation frameworks, stored procedures, and materialized analytical logic.

## MUST
- Transformations MUST declare input grain, output grain, business assumptions, and deterministic keys.
- Nontrivial transformations MUST be testable independently from orchestration.
- Incremental logic MUST produce the same final state as an authoritative rebuild for supported scenarios.
- Business-critical derivations MUST have explicit validation against known examples or trusted references.

## MUST NOT
- MUST NOT hide material business logic in scheduler configuration or opaque runtime parameters.
- MUST NOT rely on accidental row ordering.

## SHOULD
- Prefer composable transformations with narrow responsibilities.
- Repeated logic SHOULD be centralized only when semantics are truly shared.

## Exceptions
Performance-motivated complexity requires benchmark evidence and documented maintenance cost.

## Verification
Review SQL plans, transformation tests, full-versus-incremental comparisons, and code review evidence.