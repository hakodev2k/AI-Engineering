# Android Accessibility

## Purpose
Build Android interfaces that remain operable and understandable with screen readers, switch access, keyboard navigation, magnification, larger text, and reduced-motion needs.

## When to use
Use for new UI, design-system work, accessibility defects, or release readiness reviews.

## Inputs
UI flows, semantic requirements, design assets, supported form factors, accessibility acceptance criteria.

## Preconditions
Test on actual Android accessibility services rather than relying only on visual inspection.

## Context to inspect
Compose semantics or View accessibility properties, touch targets, focus order, labels, roles, state descriptions, custom gestures, contrast, text scaling, and motion.

## Core knowledge
Accessibility semantics must communicate role, name, state, and action independently of visual presentation. Custom controls require explicit semantics and predictable focus behavior.

## Procedure
1. Traverse each critical screen with TalkBack.
2. Verify meaningful labels, roles, states, and actions.
3. Remove duplicate/noisy announcements from decorative content.
4. Ensure logical traversal and keyboard/switch focus order.
5. Check touch target size and alternatives to gesture-only actions.
6. Test large font and display scaling without clipping or lost actions.
7. Verify contrast and non-color cues for status.
8. Respect reduced-motion expectations where animation is nonessential.
9. Test errors, dialogs, dynamic updates, and loading states.
10. Add automated accessibility checks where useful, while retaining manual assistive-technology testing.

## Decision points
Merge semantics when descendants form one conceptual control; keep them separate when users need independent focus/actions.

## Common failure patterns
Content descriptions on decorative icons, unlabeled icon buttons, focus traps, tiny touch targets, fixed-height text containers, gesture-only controls, and status communicated by color alone.

## Verification
Complete critical journeys with TalkBack and keyboard/switch-like input, test font scaling, and confirm automated checks have no unexplained high-impact findings.

## Expected output
Accessible semantics/focus behavior, remediated issues, and device-level verification evidence.

## Stop conditions
Escalate when design requirements fundamentally block accessible operation or custom controls cannot expose equivalent semantics/actions.