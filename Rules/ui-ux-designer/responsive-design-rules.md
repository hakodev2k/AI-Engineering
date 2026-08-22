# Responsive Design Rules
## Purpose
Preserve task completion across supported viewports and input modes.
## Scope
Layouts, breakpoints, touch, pointer, keyboard, zoom, and orientation.
## MUST
- Define behavior from content and task needs rather than device names alone.
- Preserve critical actions and information at supported widths and zoom levels.
- Test long content, errors, empty states, and dense data at boundary widths.
## MUST NOT
- Hide critical functionality solely because space is limited.
- Assume hover exists on touch devices.
## SHOULD
- Use adaptive patterns when simple reflow is insufficient.
## Exceptions
Unsupported contexts must be explicit in requirements.
## Verification
Test breakpoint boundaries, orientation, zoom, text scaling, touch, and keyboard.