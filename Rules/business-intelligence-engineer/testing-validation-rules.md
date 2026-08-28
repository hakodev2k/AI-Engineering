# Testing and Validation Rules

## Purpose
Protect BI consumers from regressions in data, logic, and presentation.

## Scope
Applies to transformations, semantic models, metrics, reports, and dashboard releases.

## MUST
- Critical business logic MUST have automated or repeatable validation against known expected results.
- Changes to joins, filters, aggregation, date logic, or metric formulas MUST include regression validation.
- Production releases MUST validate representative edge cases, including nulls, empty populations, boundary dates, and duplicate-risk joins where relevant.
- Test failures affecting correctness MUST block publication until resolved or explicitly approved as an exception.

## MUST NOT
- MUST NOT validate only row counts when value correctness is material.
- MUST NOT use production success as the first test of a breaking analytical change.

## SHOULD
- Tests SHOULD include reconciliations to an independent trusted source for high-impact metrics.

## Exceptions
Exceptions require documented risk, manual evidence, approver, and follow-up test plan.

## Verification
Inspect CI results, test cases, expected fixtures, reconciliations, and release evidence.