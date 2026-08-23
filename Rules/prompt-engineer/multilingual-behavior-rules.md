# Multilingual Behavior Rules

## Purpose
Preserve prompt intent and safety across supported languages.

## Scope
Multilingual inputs, outputs, translated prompts, locale-specific instructions, and cross-language retrieval.

## MUST
- Supported languages MUST be evaluated for critical behavior rather than assumed equivalent to the source language.
- Safety, authorization, and output constraints MUST remain semantically equivalent across translations.
- Locale-sensitive formatting and terminology MUST be explicitly specified when correctness depends on them.
- Ambiguous translated requirements MUST be resolved against the authoritative product intent.

## MUST NOT
- MUST NOT weaken security or policy constraints because an input is written in another language.
- MUST NOT treat machine translation quality as sufficient evidence for high-impact workflows.
- MUST NOT mix languages in required machine-readable fields unless the contract permits it.

## SHOULD
- Native-language evaluation examples SHOULD cover important markets and high-risk paths.
- Translation-independent identifiers SHOULD be used for schemas and control values.

## Exceptions
A product may intentionally support only a defined language subset if unsupported languages are detected and handled explicitly.

## Verification
Run multilingual regression suites, compare critical semantics across locales, and inspect locale-specific output behavior.