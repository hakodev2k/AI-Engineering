# Selector Rules

## Purpose
Make UI automation selectors stable, meaningful, and resistant to cosmetic change.

## Scope
Applies to DOM, native UI, mobile, and accessibility-based element identification.

## MUST
- Selectors MUST identify the intended element unambiguously within the tested state.
- Critical automation SHOULD use explicit test contracts or stable accessible semantics when available.
- Selector failures MUST produce enough evidence to distinguish missing elements from incorrect page state.
- Changes to shared selector contracts MUST assess affected tests.

## MUST NOT
- MUST NOT rely primarily on fragile DOM depth, generated class names, transient IDs, or presentation text when stable alternatives exist.
- MUST NOT use broad selectors that silently match the wrong element.
- MUST NOT add test-only identifiers containing sensitive business or user information.

## SHOULD
- Prefer role/name or dedicated stable test attributes according to application conventions.
- Keep selector ownership near the domain/component abstraction that uses it.

## Exceptions
Legacy interfaces may require structural selectors; document the fragility and add targeted regression evidence.

## Verification
Review selector uniqueness, run against representative layouts and data, inspect failures, and test minor cosmetic changes where practical.