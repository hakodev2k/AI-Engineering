# Accessibility and Localization Rules

## Purpose
Keep core gameplay usable across supported abilities, languages, regions, and display conditions.

## Scope
Controls, text, captions, color, motion, UI scaling, locale data, fonts, and bidirectional layouts.

## MUST
- Player-critical information MUST NOT rely solely on color, audio, or another single sensory channel when alternatives are required by product accessibility goals.
- User-facing text intended for localization MUST be externalizable and support runtime text expansion.
- Input-critical actions MUST respect supported remapping and accessibility settings.
- Locale-sensitive numbers, dates, pluralization, and text direction MUST use appropriate localization mechanisms.

## MUST NOT
- MUST NOT bake translatable text into assets when it prevents supported localization.
- MUST NOT make accessibility settings reset unexpectedly across sessions.

## SHOULD
- Motion, flashing, subtitle, contrast, and text-size options SHOULD follow applicable platform and product standards.

## Exceptions
Deliberate language-specific or sensory mechanics require design review and documented alternatives or constraints.

## Verification
Use pseudo-localization, locale matrices, accessibility review, controller-only navigation, contrast/text checks, and representative assistive settings.