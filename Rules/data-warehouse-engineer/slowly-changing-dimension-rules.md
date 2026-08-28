# Slowly Changing Dimension Rules

## Purpose
Preserve correct historical interpretation of changing dimensional attributes.

## Scope
Applies to Type 1, Type 2, hybrid history, effective dating, and surrogate-key strategies.

## MUST
- Each changing attribute MUST have an explicit history policy aligned with analytical requirements.
- Effective and expiration boundaries MUST be deterministic and non-overlapping for Type 2 history.
- Late-arriving corrections MUST define whether historical facts are re-keyed, restated, or preserved.
- Surrogate-key assignment MUST be stable and collision-safe.

## MUST NOT
- MUST NOT overwrite historically significant attributes with Type 1 behavior without approval.
- MUST NOT create overlapping active versions for the same business key.

## SHOULD
- Prefer simple history patterns unless more complex temporal semantics are required.
- Historical restatement SHOULD be auditable.

## Exceptions
Any deviation requires documented business semantics and downstream impact analysis.

## Verification
Inspect temporal constraints, duplicate-active-row tests, late-arrival tests, and historical query samples.