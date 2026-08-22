# Design System Rules
## Purpose
Maintain a coherent reusable design language without harmful abstraction.
## Scope
Components, tokens, patterns, variants, contribution, and deprecation.
## MUST
- Reuse existing patterns when they satisfy the documented need.
- Justify new shared components with recurring use cases, ownership, states, accessibility, and API expectations.
- Define migration guidance before removing widely used patterns.
## MUST NOT
- Fork shared components merely to bypass constraints.
- Add variants duplicating existing semantics.
## SHOULD
- Contribute reusable improvements back to the shared system.
## Exceptions
Product-specific components are valid when reuse creates harmful coupling.
## Verification
Audit component usage, variants, tokens, documentation, accessibility, and migration impact.