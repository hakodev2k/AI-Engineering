# Feature Contract Rules

## Purpose
Protect stable, explicit semantics for production features and prevent silent consumer breakage.

## Scope
Feature names, definitions, types, entity keys, nullability, ownership, freshness, and compatibility.

## MUST
- Every production feature MUST define semantic meaning, entity key, data type, owner, null behavior, and freshness expectation.
- Consumer-visible changes MUST be classified as backward-compatible or breaking before release.
- Event-time versus processing-time semantics MUST be explicit.
- Breaking changes MUST include a migration and consumer validation plan.
- Defaults MUST have documented meaning and MUST be distinguishable from missing data where required.

## MUST NOT
- A feature identifier MUST NOT retain the same name when its business meaning materially changes.
- Defaults MUST NOT conceal invalid or unavailable source data.
- A feature contract MUST NOT depend on undocumented tribal knowledge.

## SHOULD
- Contracts SHOULD be machine-readable and validated in CI.
- Deprecated features SHOULD identify replacement features and sunset dates.

## Exceptions
Exceptions require rationale, affected consumers, risk, migration evidence, and owner approval.

## Verification
Inspect catalog metadata, schema diffs, contract tests, and consumer compatibility evidence.