# Accessibility Conformance Rules

## Purpose
Ensure that AI-assisted product changes preserve access for people using keyboards, assistive technology, magnification, alternate input, reduced motion, and differing sensory or cognitive needs.

## Scope
Applies to user-facing web, mobile, document, and design-system changes, including new flows, components, content, error states, authentication, and release communications.

## MUST
- Use native semantic controls and document structure where the platform provides them; provide an accurate accessible name, role, state, and value for every custom control.
- Make every supported task operable by keyboard or the platform-equivalent alternate input, with a visible, predictable focus order and no keyboard trap.
- Keep labels, instructions, validation errors, status changes, and required fields programmatically associated with the relevant control.
- Preserve sufficient contrast, text scaling, reflow, and non-color cues for state, validation, and meaning.
- Respect user settings for reduced motion, zoom, contrast, text size, and platform accessibility preferences.
- Test the affected journey with automated checks and representative manual keyboard and assistive-technology checks before claiming conformance.

## MUST NOT
- MUST NOT replace a native button, link, input, heading, list, table, or landmark with a generic element when the native element satisfies the interaction.
- MUST NOT hide or remove focus indication, rely only on color, pointer gestures, hover, audio, or animation to convey required information, or move focus unexpectedly.
- MUST NOT mark a control as accessible solely because an automated scanner returns no finding.
- MUST NOT release a known blocking accessibility regression without an approved exception, a safe alternative path, an owner, and a remediation deadline.

## SHOULD
- SHOULD set an explicit accessibility target, affected assistive technologies, and supported platforms in the work item.
- SHOULD use the target repository's component library and established accessible interaction patterns before creating a custom control.
- SHOULD include people with relevant access needs in research or usability validation when the journey is high impact or the interaction is novel.

## Exceptions
An exception requires the affected users and task to be documented, an accessible alternative or mitigation, the reason the normal requirement cannot be met, accessibility and product approval, a risk owner, and a dated remediation plan. Delivery pressure alone is not an exception.

## Verification
Record the affected journey, keyboard result, focus behavior, semantic/name/state check, contrast or visual result, assistive-technology result where applicable, automated findings, known limitations, and the owner of any exception. Re-test after design-system, browser, platform, or localization changes that affect the flow.
