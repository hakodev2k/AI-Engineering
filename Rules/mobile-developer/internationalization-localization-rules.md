# Internationalization and Localization Rules
## Purpose
Prevent locale, language, formatting, and layout assumptions from corrupting data or blocking users.
## Scope
Translations, locale formatting, calendars, time zones, pluralization, RTL layouts, and localized assets.
## MUST
- Stored/transmitted machine values MUST use locale-independent formats.
- User-visible dates, numbers, currency, units, and plural forms MUST follow defined locale/product rules.
- Layouts MUST tolerate realistic text expansion and supported right-to-left direction where applicable.
## MUST NOT
- Display strings MUST NOT be used as stable program identifiers.
- Device locale MUST NOT silently change domain semantics that require an explicit user or business setting.
## SHOULD
- Localization keys SHOULD carry enough context to avoid ambiguous translation.
## Exceptions
Single-locale products may defer additional locales but MUST still keep machine data locale-independent.
## Verification
Test multiple locales, RTL, long translations, time zones, calendars, number formats, and language switching.