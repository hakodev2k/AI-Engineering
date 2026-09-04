# Message Formatting Rules

## Purpose
Ensure localized messages preserve grammar, variables, pluralization, gender, and select logic across languages.

## Scope
Applies to message-format syntax, interpolation, plural/select expressions, rich text, and localized notification content.

## MUST
- Variable interpolation MUST use a locale-aware message-format mechanism capable of expressing required plural and selection rules.
- Every placeholder MUST have a documented semantic type and MUST be validated against every localized message that references it.
- Plural logic MUST use locale-specific plural categories rather than English singular/plural assumptions.
- Rich-text placeholders MUST preserve escaping and sanitization boundaries.
- Message compilation or parsing failures MUST fail validation before production release.

## MUST NOT
- User-controlled values MUST NOT be injected into localized rich text without the same output-encoding or sanitization required elsewhere.
- Messages MUST NOT encode pluralization with numeric comparisons that assume one universal grammar.
- Translators MUST NOT be forced to reconstruct sentences from separately translated fragments.

## SHOULD
- Complex messages SHOULD include examples for translators and reviewers.
- Message schemas SHOULD be statically validated where tooling supports it.

## Exceptions
Exceptions require a linguistic rationale, affected locales, evidence that grammar remains correct, and review by the responsible localization owner.

## Verification
Compile catalogs, validate placeholder sets and types, test plural categories and edge quantities, run pseudo-localization, and inspect rich-text sanitization tests.