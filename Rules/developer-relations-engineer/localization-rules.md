# Localization Rules

## Purpose
Preserve technical meaning and developer usability when content is adapted across languages and regions.

## Scope
Applies to translated documentation, captions, tutorials, event material, UI-adjacent guidance, and regional community content.

## MUST
- Product names, API names, code, protocol identifiers, and version-specific terminology MUST remain technically unambiguous after localization.
- Translated technical claims MUST be checked against the authoritative source rather than translated from memory.
- Locale-specific examples involving dates, numbers, currencies, or legal context MUST be validated for the target audience.
- Material source updates MUST trigger review of affected localized derivatives.

## MUST NOT
- MUST NOT translate code identifiers or commands when doing so changes executable meaning.
- MUST NOT imply feature availability in a region where it is not confirmed.
- MUST NOT allow localized copies to drift indefinitely from safety-critical source guidance.

## SHOULD
- Local terminology SHOULD reflect established developer usage in the target language.
- High-impact translations SHOULD receive review from a technically fluent native or near-native reviewer.

## Exceptions
English technical terms may be retained when translation reduces precision; the surrounding explanation should clarify meaning.

## Verification
Compare localized content with authoritative sources, review terminology, execute preserved commands, and inspect regional assumptions and freshness links.