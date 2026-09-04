# Component Abstraction Rules

## Purpose
Keep reusable browser interaction code aligned with stable UI capabilities without creating brittle page-object monoliths.

## Scope
Applies to page objects, component objects, fixtures, helpers, domain drivers, and shared interaction libraries.

## MUST
- Reusable abstractions MUST represent coherent capabilities with a clear ownership boundary.
- Selector and interaction details MUST be encapsulated when callers should not depend on those implementation details.
- Public automation methods MUST expose meaningful inputs and outcomes rather than arbitrary low-level browser primitives.
- Changes to shared abstractions MUST be evaluated against all materially different consumers.
- Abstractions MUST preserve useful failure context from underlying browser operations.

## MUST NOT
- Large page objects MUST NOT become unbounded repositories of unrelated workflow logic.
- Generic helpers MUST NOT hide important domain intent or silently catch failures.
- Abstraction layers MUST NOT be added solely to reduce line count when they increase indirection without reducing coupling.

## SHOULD
- Component boundaries SHOULD follow stable user-facing regions or domain capabilities.
- Repeated flows SHOULD be centralized only after their invariants and meaningful variations are understood.

## Exceptions
A direct locator interaction may remain local when it is unique, simple, and unlikely to create coupling. Document unusual framework constraints that require alternate patterns.

## Verification
Review dependency direction, method responsibilities, call-site readability, duplication, change impact, and representative failures. Confirm a localized UI change does not require unrelated workflow edits.