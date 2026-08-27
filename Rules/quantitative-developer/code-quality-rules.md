# Code Quality Rules

## Purpose
Keep quantitative software reviewable, maintainable, and safe to change.

## Scope
Applies to production code and decision-grade research code intended for reuse.

## MUST
- Financial semantics, units, invariants, and boundary assumptions MUST be represented clearly in interfaces and tests.
- Shared quantitative logic MUST have a single authoritative implementation or explicit consistency tests.
- Complex algorithms MUST include rationale and references sufficient for expert review.
- Refactors MUST preserve validated behavior through automated regression tests.
- Public interfaces MUST define error behavior and compatibility expectations.

## MUST NOT
- Dense vectorized code MUST NOT be preferred over understandable code when correctness cannot be readily reviewed.
- Magic constants with financial meaning MUST NOT be embedded without names, units, and provenance.
- Dead experimental branches MUST NOT remain in production decision paths.

## SHOULD
- Separate pure calculations from I/O and mutable state.
- Prefer explicit domain types for quantities whose accidental interchange would be costly.

## Exceptions
Exceptions require documented reason, bounded scope, verification, and planned remediation when technical debt is accepted.

## Verification
Use static analysis, code review, complexity inspection, unit/property tests, API compatibility checks, and diff-based regression testing against validated outputs.