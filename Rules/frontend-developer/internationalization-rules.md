# Internationalization Rules
## Purpose
Prevent locale assumptions from corrupting content, layout, dates, numbers, or workflows.
## Scope
Translation, locale formatting, text direction, pluralization, time zones, and content expansion.
## MUST
- User-visible translatable text MUST use the project's localization mechanism when localization is in scope.
- Dates, times, numbers, and currencies MUST be formatted with explicit locale/time-zone semantics appropriate to the domain.
- Business logic MUST NOT infer authoritative values by parsing localized display strings.
- Layouts MUST tolerate realistic text expansion and supported writing directions.
## MUST NOT
- Concatenated translated fragments MUST NOT be used when grammar depends on order or plurality.
- Local machine timezone MUST NOT silently define business timestamps.
## SHOULD
- Use structured message formatting for plural and grammatical variants.
## Exceptions
Non-localized internal tooling requires explicit scope.
## Verification
Pseudo-localization, locale tests, timezone boundary tests, RTL inspection where supported, and content review.