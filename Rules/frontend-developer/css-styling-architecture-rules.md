# CSS and Styling Architecture Rules
## Purpose
Keep styling predictable, scalable, and resistant to unintended cross-feature regressions.
## Scope
CSS architecture, selectors, tokens, theming, cascade, and style ownership.
## MUST
- Styling strategy MUST follow the project's established scoping and token conventions unless a reviewed migration changes them.
- Shared visual values with semantic meaning MUST use approved tokens rather than duplicated magic values where a token exists.
- Global selectors and overrides MUST have intentionally bounded impact.
- Theme changes MUST preserve required contrast and interaction states.
## MUST NOT
- Specificity escalation or broad !important usage MUST NOT be the default mechanism for resolving architecture conflicts.
- Feature-local styling MUST NOT depend on undocumented DOM structure outside its ownership boundary.
## SHOULD
- Prefer semantic variants and stable component contracts over consumer-side selector overrides.
## Exceptions
Third-party integration overrides require isolated scope and explanatory documentation.
## Verification
Visual regression, computed-style inspection, selector scope review, theme/accessibility tests, and cross-page smoke tests.