# Visualization Accessibility

## Purpose
Make analytical content operable and understandable for users with visual, motor, cognitive, or assistive-technology needs.

## When to use
During design, implementation, review, or remediation of any user-facing visualization.

## Inputs
Visuals, interaction flows, accessibility standard, target devices, component library.

## Core knowledge
Accessibility requires more than color contrast. Charts need textual equivalents, keyboard operation, meaningful focus order, non-color cues, scalable text, and understandable announcements for dynamic changes.

## Procedure
1. Define applicable accessibility requirements.
2. Check text and graphical contrast.
3. Ensure critical meaning is not encoded by color alone.
4. Provide concise chart titles, descriptions, and accessible data summaries.
5. Make controls and interactive marks keyboard reachable where interaction is required.
6. Define logical focus order and visible focus states.
7. Ensure tooltips have non-hover access.
8. Test zoom, reflow, and responsive layouts.
9. Test with screen-reader and keyboard workflows.
10. Document unavoidable limitations and equivalent alternatives.

## Decision points
Prefer a data table or textual summary as an equivalent path when complex graphics cannot expose all information accessibly. Reduce interaction complexity rather than layering inaccessible workarounds.

## Common failure patterns
Color-only status; inaccessible canvas/SVG marks; hover-only tooltips; focus traps; unlabeled filters; reading order differing from visual order; tiny dense labels.

## Verification
Run automated checks plus manual keyboard, zoom, contrast, and screen-reader task tests.

## Expected output
An accessible visualization with documented alternatives and evidence for required conformance criteria.

## Stop conditions
Escalate when required interaction cannot be made accessible within the current technology or design constraints.