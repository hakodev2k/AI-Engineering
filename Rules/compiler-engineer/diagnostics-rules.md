# Diagnostics Rules

## Purpose
Make compiler failures actionable, stable enough for tooling, and safe for hostile input.

## Scope
Errors, warnings, notes, fix-its, source ranges, and diagnostic APIs.

## MUST
- Diagnostics MUST distinguish invalid user input from internal compiler failures.
- Error messages MUST identify the relevant source location when available.
- Machine-consumed diagnostic formats MUST have explicit compatibility rules.
- Fix-its MUST produce syntactically valid edits for the stated case.

## MUST NOT
- MUST NOT expose secrets, host paths, or unrelated process data in diagnostics by default.
- MUST NOT emit misleading success after a fatal compilation error.
- MUST NOT create unbounded diagnostic cascades from one malformed construct.

## SHOULD
- Diagnostics SHOULD explain the violated constraint and a safe correction when known.
- Warnings SHOULD have stable identifiers where suppression is supported.

## Exceptions
Compatibility-sensitive wording changes require tooling impact review.

## Verification
Use golden diagnostic tests, malformed-input fuzzing, structured-output schema tests, and fix-it application tests.