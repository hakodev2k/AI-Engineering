# Accessibility Integration Rules
## Purpose
Keep browser semantics, accessibility trees, events, and platform mappings correct for assistive technology.
## Scope
DOM-to-accessibility mapping, tree updates, focus, names, roles, states, and platform adapters.
## MUST
- Web-visible semantic changes MUST propagate required accessibility updates.
- Accessibility tree ownership and lifecycle MUST remain synchronized with document lifecycle.
- Focus and state transitions MUST emit correct platform-observable semantics.
## MUST NOT
- MUST NOT optimize away accessibility updates without proving semantic equivalence.
- MUST NOT expose stale or cross-document nodes after navigation or teardown.
## SHOULD
- SHOULD test representative assistive-technology interaction paths, not only internal trees.
## Exceptions
Platform-specific deviations require documented platform constraints and accessibility review.
## Verification
Use accessibility tree tests, platform API inspection, focus tests, automated accessibility suites, and manual AT checks for critical changes.