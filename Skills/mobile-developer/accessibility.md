# Mobile Accessibility

## Purpose
Make mobile experiences operable and understandable with assistive technologies and diverse input/vision needs.

## When to use
Feature implementation, design review, release QA, accessibility defects.

## Inputs
Screens, user flows, design specs, accessibility requirements.

## Context to inspect
Semantic tree, labels, focus order, touch targets, contrast, text scaling, gestures, motion.

## Core knowledge
Visual appearance is not the accessibility tree. Native semantics, logical focus, scalable text, alternatives to gestures, and dynamic announcements matter.

## Procedure
1. Inspect semantic roles/names/states.
2. Ensure logical reading/focus order.
3. Verify touch targets and non-gesture alternatives.
4. Test large text and layout reflow.
5. Check contrast and non-color cues.
6. Announce meaningful dynamic changes.
7. Respect reduced-motion settings where relevant.
8. Test with platform screen readers and keyboard/switch input where supported.

## Decision points
Prefer native accessible controls; custom controls require equivalent semantics and interaction.

## Common failure patterns
Icon-only unlabeled controls, focus traps, fixed text layouts, gesture-only actions, decorative images announced.

## Verification
Manual assistive-tech testing plus automated checks where available.

## Expected output
Accessible interaction with documented exceptions.

## Stop conditions
Escalate design requirements that inherently block accessible alternatives.