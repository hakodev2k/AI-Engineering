# Pseudo-Localization Testing Rules

## Purpose
Detect internationalization defects before human translation is complete.

## Scope
Applies to pseudo-locales, automated UI tests, translation extraction, layout expansion, bidi simulation, and untranslated-string detection.

## MUST
- Products with localized UI MUST provide a repeatable pseudo-localization test path before adding or materially changing supported locales.
- Pseudo-localization MUST exercise text expansion, non-ASCII characters, and visible marking of translatable strings.
- RTL-capable interfaces MUST include a direction-reversed pseudo-locale or equivalent deterministic test mechanism.
- Automated checks MUST detect user-visible source strings that bypass the translation resource system where practical.
- Critical user journeys MUST be exercised under pseudo-localization before internationalization-sensitive releases.

## MUST NOT
- Pseudo-localization MUST NOT modify identifiers, URLs, protocol tokens, code, or other non-translatable values in ways that create false failures.
- Passing source-locale tests MUST NOT be treated as evidence of localization readiness.
- Pseudo-locales MUST NOT be exposed to production users unless explicitly supported for diagnostic purposes.

## SHOULD
- Visual regression baselines SHOULD include at least one expanded pseudo-locale and one RTL case.
- CI SHOULD fail on malformed resources or placeholder mismatches detected by pseudo-localization tooling.

## Exceptions
Exceptions require documented tooling limitations, compensating tests, risk, and an owner for closure.

## Verification
Run pseudo-localized builds, critical-path E2E tests, screenshot comparison, resource extraction checks, RTL navigation, and untranslated-string detection.