# Internationalized API Contract Rules

## Purpose
Keep service contracts locale-safe while preventing presentation conventions from leaking into canonical data exchange.

## Scope
Applies to APIs carrying locale, language, timezone, currency, translated content, dates, numbers, and localized errors.

## MUST
- APIs MUST distinguish canonical machine-readable values from localized presentation strings.
- Locale, timezone, currency, and measurement context MUST be explicit when response meaning depends on them.
- Localized errors MUST preserve stable machine-readable error codes independent of translated messages.
- Contract changes affecting locale negotiation or localized fields MUST be reviewed for backward compatibility.
- Structured dates, numbers, and monetary values MUST use unambiguous interchange representations.

## MUST NOT
- Consumers MUST NOT be required to parse localized display strings to recover authoritative values.
- Translated message text MUST NOT be used as an API identifier or control-flow discriminator.
- An API MUST NOT silently change response language based on undocumented ambient server state.

## SHOULD
- APIs SHOULD return canonical data and allow presentation localization at the appropriate consumer boundary unless centralized localization is a deliberate architecture choice.
- Supported-locale capabilities SHOULD be discoverable when clients need negotiation.

## Exceptions
Exceptions require documented consumer constraints, compatibility analysis, fallback semantics, and tests.

## Verification
Review schemas, contract tests, locale negotiation tests, error payloads, date/number serialization, fallback behavior, and compatibility diffs across versions.