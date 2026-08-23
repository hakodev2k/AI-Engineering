# Accessibility and Dynamic Type

## Purpose
Make iOS interfaces operable and understandable with VoiceOver, Dynamic Type, reduced motion, alternative input, and accessibility semantics.

## When to use
Use for every user-facing feature and when auditing accessibility defects.

## Inputs
Screen flows, design intent, content hierarchy, supported locales, custom controls.

## Context to inspect
Accessibility labels/traits/actions, focus order, Dynamic Type, contrast, hit targets, motion, UIKit/SwiftUI custom elements.

## Core knowledge
Accessibility is behavior, not metadata alone. Native semantic controls provide strong defaults. Text enlargement can change layout dramatically and must not hide essential actions/content.

## Procedure
1. Navigate the feature with VoiceOver.
2. Ensure meaningful elements have concise names, values, traits, and actions.
3. Remove redundant/decorative elements from the accessibility tree.
4. Validate focus order and modal focus containment.
5. Test largest Dynamic Type sizes.
6. Support reduced motion and non-color cues.
7. Check hit targets and custom gestures for alternatives.
8. Test state/error announcements.
9. Add accessibility identifiers only for automation needs, not as user semantics.

## Decision points
Prefer native controls over recreating semantics. Group elements when combined reading improves comprehension without hiding independent actions.

## Common failure patterns
Duplicate announcements, inaccessible custom gestures, clipped large text, icon-only unlabeled buttons, focus loss, and color-only status.

## Verification
Manual assistive-technology pass plus automated accessibility checks where available across representative flows.

## Expected output
Accessible semantics, scalable layout, and documented verification evidence.

## Stop conditions
Escalate when design requirements fundamentally prevent accessible operation or required assistive behavior cannot be achieved with supported APIs.