# Layout Expansion Rules

## Purpose
Keep interfaces usable when translated text expands, contracts, wraps differently, or uses different typographic metrics.

## Scope
Applies to responsive layouts, components, dialogs, navigation, tables, labels, buttons, and constrained surfaces.

## MUST
- UI components MUST tolerate realistic translation expansion without clipping, overlap, hidden controls, or loss of information.
- Text containers MUST support wrapping or adaptive sizing unless truncation is an explicit product requirement.
- Truncation of translated content MUST preserve access to the complete meaning through an appropriate interaction or alternative.
- Fixed dimensions around translatable text MUST be justified by platform constraints and verified across target locales.
- Critical actions and validation messages MUST remain visible and operable under text expansion.

## MUST NOT
- Production layouts MUST NOT rely on English string length as a sizing contract.
- Smaller font sizes MUST NOT be used as the default remedy for translation expansion.
- Meaningful translated text MUST NOT be silently clipped.

## SHOULD
- Pseudo-localization SHOULD be included in UI regression testing.
- Components SHOULD be tested with long compound words and scripts with different line-breaking behavior.

## Exceptions
Exceptions require documented platform constraints, affected locales, mitigation, accessibility impact, and visual verification.

## Verification
Run pseudo-localization, visual regression, responsive viewport tests, font-scaling tests, long-string fixtures, RTL layouts, and manual inspection of critical flows.