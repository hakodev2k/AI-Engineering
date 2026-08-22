# Design System Rules

## Purpose
Keep reusable UI primitives consistent, accessible, evolvable, and separate from feature-specific behavior.

## Scope
Applies to shared components, tokens, theming, layout primitives, and visual conventions.

## MUST
- Design-system components MUST encode stable cross-application behavior rather than one-off feature policy.
- Shared visual tokens MUST be used for values that are intentionally system-wide.
- Breaking changes to shared component APIs MUST include impact analysis and migration guidance.
- Accessibility requirements MUST be preserved by default in reusable primitives.
- Variant APIs MUST remain bounded and understandable; new variants MUST represent meaningful reusable states.

## MUST NOT
- MUST NOT place business rules or feature-specific data fetching inside generic design-system components.
- MUST NOT create new shared primitives solely to avoid small local composition.
- MUST NOT override accessibility behavior for visual convenience without equivalent accessible behavior.

## SHOULD
- Prefer composition and tokens over large prop matrices.
- Prefer visual regression coverage for high-use primitives.

## Exceptions
Document why feature-specific behavior must enter a shared primitive, affected consumers, migration risk, and owner approval.

## Verification
Use story/example review, accessibility tests, visual regression tests, consumer search, and API compatibility review.