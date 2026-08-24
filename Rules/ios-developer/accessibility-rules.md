# Accessibility Rules

## Purpose
Ensure core application journeys remain operable and understandable with iOS accessibility features.

## Scope
VoiceOver, Dynamic Type, contrast, focus, motion, input alternatives, semantics, and accessible errors.

## MUST
- Interactive controls MUST expose correct semantic role, label, state, and action when defaults are insufficient.
- Core journeys MUST remain usable with VoiceOver and large accessibility text sizes.
- Information MUST NOT depend solely on color, sound, motion, or gesture without an accessible alternative.
- Custom controls MUST provide equivalent accessibility behavior to native controls.
- Validation and error states MUST be discoverable by assistive technology.

## MUST NOT
- MUST NOT hide meaningful content from the accessibility tree for visual convenience.
- MUST NOT fix layout breakage by disabling Dynamic Type for user-facing text without approved justification.
- MUST NOT require precision gestures when an accessible standard action can be provided.

## SHOULD
- Prefer native semantic controls and system text styles.
- Respect reduced motion and other relevant accessibility preferences.

## Exceptions
Document the affected users, platform limitation, alternative considered, mitigation, and approval for any inaccessible behavior.

## Verification
Test representative flows with VoiceOver, accessibility text sizes, Accessibility Inspector, keyboard/switch input where relevant, and automated accessibility assertions.