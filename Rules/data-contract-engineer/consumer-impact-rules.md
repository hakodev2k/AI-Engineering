# Consumer Impact Rules

## Purpose
Require evidence about downstream effects before contract changes are released.

## Scope
Applies to structural, semantic, quality, freshness, availability, and lifecycle changes affecting shared data.

## MUST
- Material changes MUST identify known consumers and classify expected impact before approval.
- Breaking or behavior-changing updates MUST include a migration sequence and completion criteria.
- Unknown consumer risk MUST be stated explicitly when discovery is incomplete.
- Critical consumers MUST receive validation evidence before cutover when their workflows could fail or produce incorrect decisions.

## MUST NOT
- Absence of complaints MUST NOT be treated as evidence of compatibility.
- Producers MUST NOT assume consumers only use documented fields when usage evidence indicates otherwise.
- High-impact changes MUST NOT proceed solely on producer-side test success.

## SHOULD
- Consumer inventories SHOULD include owner, usage purpose, criticality, and supported contract version.
- Impact analysis SHOULD use lineage and telemetry rather than manual lists alone.

## Exceptions
Exceptions require bounded risk, mitigation, rollback or containment plan, and explicit approval.

## Verification
Review consumer inventories, lineage, usage telemetry, migration records, contract tests, and sign-off evidence for critical dependents.