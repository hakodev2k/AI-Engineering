# Test Architecture Rules

## Purpose
Define maintainable boundaries for Senior-level automated test systems.

## Scope
Applies to UI, API, integration, contract, and system automation suites.

## MUST
- Test layers MUST have explicit responsibilities, ownership, and execution purpose.
- Shared abstractions MUST reduce stable duplication without hiding business intent or failure evidence.
- Test code MUST be treated as production-quality software with review, versioning, and maintainability standards.
- Architecture decisions affecting many tests MUST document migration and compatibility impact.

## MUST NOT
- MUST NOT centralize unrelated behavior into generic helpers that obscure test intent.
- MUST NOT couple independent test domains through mutable global state.
- MUST NOT duplicate product implementation logic merely to reproduce expected results.

## SHOULD
- Prefer domain-oriented fixtures and helpers over page-wide utility collections.
- Prefer simple explicit abstractions until repeated stable patterns justify reuse.

## Exceptions
Deviations require documented context, risk, alternative considered, and reviewer approval when suite-wide behavior changes.

## Verification
Review dependency direction, fixture ownership, helper usage, suite structure, change blast radius, and representative failure output.