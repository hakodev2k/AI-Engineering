# Localization Readiness Rules
## Purpose
Keep source documentation translatable without changing technical meaning.
## Scope
Terminology, strings, examples, screenshots, variables, cultural references, and locale-sensitive values.
## MUST
- Keep terminology consistent and define terms that must remain untranslated or have approved translations.
- Separate translatable prose from code, identifiers, commands, and machine-sensitive tokens.
- Make units, dates, numbers, time zones, addresses, and locale-dependent behavior explicit when relevant.
- Revalidate localized safety, legal, and high-impact content after material source changes.
## MUST NOT
- Encode essential meaning in wordplay, unexplained idiom, or culture-specific references when avoidable.
- Instruct translators to alter executable code or identifiers unless localization is part of the interface contract.
## SHOULD
- Design screenshots and diagrams to minimize embedded text when localization cost is material.
## Exceptions
Brand or legal terminology may remain fixed when governed by approved policy.
## Verification
Terminology checks, localization pseudo-tests, translation review, and validation of locale-sensitive examples.