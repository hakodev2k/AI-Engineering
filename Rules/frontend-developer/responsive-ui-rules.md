# Responsive UI Rules
## Purpose
Keep workflows usable across supported viewport, input, and device constraints.
## Scope
Layout, breakpoints, touch, orientation, zoom, and adaptive content.
## MUST
- Critical workflows MUST remain usable at all supported viewport sizes and zoom levels.
- Layout decisions MUST respond to content and interaction needs rather than arbitrary device names.
- Touch targets and gesture interactions MUST provide accessible alternatives where required.
- Overflow, truncation, and dense data presentation MUST have deliberate behavior.
## MUST NOT
- Essential information or actions MUST NOT disappear solely because viewport space is constrained.
- Hover-only interactions MUST NOT be the only path to critical functionality.
## SHOULD
- Test representative extremes rather than only common desktop and phone widths.
## Exceptions
Explicitly unsupported form factors require documented product scope.
## Verification
Visual/E2E tests across supported sizes, zoom testing, touch/keyboard inspection, and real-device checks for critical flows.