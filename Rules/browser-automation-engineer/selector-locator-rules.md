# Selector and Locator Rules

## Purpose
Ensure browser automation identifies UI targets through resilient, intentional, and reviewable locators.

## Scope
Applies to selectors, locators, page queries, element discovery, and reusable UI interaction abstractions.

## MUST
- Locators MUST target stable semantics such as accessible roles, labels, explicit test contracts, or durable domain attributes when available.
- Every locator MUST be scoped narrowly enough to identify the intended element deterministically.
- Locator changes MUST be validated against all workflows that depend on the affected abstraction.
- Repeated complex locators MUST be centralized behind a meaningful component or page capability when this reduces coupling.
- Ambiguous matches MUST fail rather than silently selecting an arbitrary element.

## MUST NOT
- Automation MUST NOT depend on volatile generated class names, transient DOM indexes, or layout position unless the project explicitly guarantees their stability.
- Arbitrary sleeps MUST NOT be used to compensate for selectors that race dynamic rendering.
- Broad selectors MUST NOT be paired with first-match behavior merely to make a failing workflow pass.

## SHOULD
- Locators SHOULD model user-observable semantics and remain readable during review.
- Test-specific attributes SHOULD be treated as explicit contracts and documented when introduced.

## Exceptions
An unstable or structural locator may be used only when no stronger contract exists and the rationale, fragility, and replacement plan are documented.

## Verification
Run strict locator checks, cross-state tests, repeated execution, code review, and DOM inspection. Confirm selectors remain unique under loading, empty, error, localized, and populated states where relevant.