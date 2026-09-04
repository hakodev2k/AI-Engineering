# Policy Authoring Quality Rules

## Purpose
Keep policy code maintainable, reviewable, deterministic, and resistant to subtle enforcement defects.

## Scope
Applies to policy source, reusable policy modules, helper functions, rule composition, naming, data references, and policy-specific abstractions.

## MUST
- Policy rules MUST express one identifiable decision concern and MUST expose dependencies on external data or contextual inputs.
- Policy logic MUST be deterministic for identical policy versions and identical inputs unless nondeterminism is an explicit documented requirement.
- Shared policy abstractions MUST preserve domain semantics rather than merely reduce line count.
- Complex deny or allow conditions MUST be decomposed so reviewers can identify the exact condition responsible for a decision.
- Policy defaults MUST be explicit and test-covered.
- Changes that alter decision semantics MUST include corresponding test changes or documented evidence that existing tests already cover the behavior.

## MUST NOT
- Policy code MUST NOT hide authorization or compliance semantics behind misleading generic helpers.
- Policy code MUST NOT rely on input fields whose provenance or type is undefined.
- Dead, unreachable, duplicated, or contradictory policy branches MUST NOT remain intentionally without documented compatibility rationale.
- Formatting or refactoring changes MUST NOT be mixed with material semantic changes when doing so obscures review.

## SHOULD
- Policy modules SHOULD align with bounded decision domains and ownership boundaries.
- Naming SHOULD describe business or control intent rather than engine-specific implementation mechanics.
- Repeated policy expressions SHOULD be centralized only when their semantics are genuinely shared.

## Exceptions
A deliberate deviation requires the reason, affected decisions, alternatives considered, tests, and reviewer approval where semantics become harder to inspect.

## Verification
Use formatter/linter output where available, static analysis, policy compiler checks, unit tests, semantic diff review, and human inspection. Reviewers should be able to explain each changed decision path from source without relying on author intent alone.