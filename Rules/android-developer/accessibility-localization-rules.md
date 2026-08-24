# Accessibility and Localization Rules

## Purpose
Ensure core Android experiences remain operable and understandable across accessibility needs, languages, and locale conventions.

## Scope
Applies to UI semantics, input, content, formatting, layout, and localized resources.

## MUST
- Provide accessible names/roles/states for actionable or meaningful UI elements.
- Preserve logical focus/navigation order and support non-touch interaction where relevant.
- Externalize user-facing text intended for localization and use locale-aware formatting for dates, numbers, currency, and plurals.
- Test critical flows with large text/font scaling and representative assistive technology behavior.
- Ensure error and validation states are conveyed by more than color alone.

## MUST NOT
- Hard-code layout assumptions that break supported right-to-left or expanded translations when those locales are supported.
- Remove semantics merely to satisfy visual design.
- Use content descriptions that duplicate noisy decorative content.

## SHOULD
- Design layouts for text expansion and dynamic sizing.
- Include accessibility and localization acceptance criteria for high-impact UI changes.

## Exceptions
Decorative elements may intentionally be excluded from accessibility semantics.

## Verification
Use Android accessibility tooling, TalkBack/manual checks, UI tests, pseudo-localization, RTL tests, font-scale tests, and design review.