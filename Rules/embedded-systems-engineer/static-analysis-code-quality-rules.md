# Static Analysis and Code Quality Rules

## Purpose
Control undefined behavior, implementation-defined assumptions, complexity, and defect-prone low-level code.

## Scope
C/C++ or equivalent firmware code, compiler warnings, static analysis, coding standards, and review.

## MUST
- Enable an agreed warning baseline and treat newly introduced high-confidence warnings as defects.
- Document architecture/compiler assumptions where behavior depends on widths, alignment, endianness, or implementation-defined semantics.
- Apply stronger coding standards to safety/security-critical modules when required.

## MUST NOT
- Suppress static-analysis findings without rationale and scoped evidence.
- Rely on undefined behavior for optimization or hardware access.

## SHOULD
- Keep low-level unsafe constructs localized behind reviewed abstractions.

## Exceptions
Tool false positives require local suppression with justification rather than disabling the rule globally.

## Verification
Run compiler warnings and static analyzers in CI; review suppressions, complexity, and target-specific assumptions.