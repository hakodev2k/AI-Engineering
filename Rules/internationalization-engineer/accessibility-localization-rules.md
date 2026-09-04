# Accessibility and Localization Rules

## Purpose
Ensure localization preserves accessibility semantics and does not introduce barriers for assistive-technology users.

## Scope
Applies to accessible names, descriptions, headings, landmarks, live regions, keyboard guidance, captions, alt text, and localized assistive text.

## MUST
- User-facing accessibility text MUST be localized with the same semantic accuracy requirements as visible UI text.
- Accessible names and descriptions MUST remain synchronized with localized visible labels and control state.
- Language metadata MUST identify the primary document language and meaningful language changes within content.
- Localized keyboard instructions MUST match actual platform behavior and key labeling.
- Captions, transcripts, and meaningful alternative text MUST preserve content meaning in supported locales when the corresponding feature is localized.

## MUST NOT
- Translation MUST NOT remove semantic distinctions required to identify controls, errors, state, or navigation.
- Screen-reader-only text MUST NOT be excluded from translation extraction merely because it is visually hidden.
- Language changes MUST NOT be communicated by color, typography, or visual placement alone.

## SHOULD
- Accessibility reviews SHOULD include screen-reader testing in representative LTR and RTL locales.
- Translator context SHOULD identify strings used exclusively by assistive technologies.

## Exceptions
Exceptions require documented accessibility impact, affected locales, mitigation, review owner, and verification evidence.

## Verification
Inspect accessibility trees, language attributes, screen-reader output, keyboard flows, localized error announcements, captions/transcripts, and automated accessibility checks supplemented by manual review.