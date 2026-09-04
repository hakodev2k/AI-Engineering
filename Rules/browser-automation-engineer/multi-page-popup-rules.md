# Multi-Page and Popup Rules

## Purpose
Make workflows involving multiple pages, tabs, windows, popups, and frames deterministic and traceable.

## Scope
Applies to new tabs, popup windows, embedded frames, cross-window navigation, and page lifecycle coordination.

## MUST
- Automation MUST correlate a newly opened page or popup with the action expected to create it.
- Page and frame references MUST have explicit ownership and lifecycle management.
- Cross-page workflows MUST validate the intended target using stable identity such as origin, URL state, title, or application-specific evidence.
- Closing or navigation events MUST be awaited when later actions depend on them.
- Failures MUST identify which page or frame was active and the relevant URL or origin, subject to redaction requirements.

## MUST NOT
- Automation MUST NOT assume a fixed tab index when browser or application behavior can change ordering.
- A first-available popup MUST NOT be accepted without validating that it is the expected one.
- Orphan pages or contexts MUST NOT accumulate across scenarios.

## SHOULD
- Multi-page workflows SHOULD minimize globally mutable current-page state.
- Frame access SHOULD use stable frame identity rather than positional assumptions where possible.

## Exceptions
A fixed ordering assumption may be used only when the browser/application contract explicitly guarantees it and the dependency is documented.

## Verification
Exercise workflows with additional incidental tabs or frames where practical, inspect lifecycle cleanup, repeat under slow navigation, and confirm target-page validation fails safely on unexpected content.