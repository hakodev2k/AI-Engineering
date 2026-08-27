# Multilingual NLP Rules

## Purpose
Prevent English-centric assumptions and uncontrolled quality gaps across supported languages.

## Scope
Language identification, multilingual modeling, script handling, locale behavior, code switching, transliteration, and language coverage.

## MUST
- Supported languages and locales MUST have explicit quality targets and evaluation evidence.
- Pipelines MUST preserve Unicode and script distinctions required by the task.
- Language-specific failures MUST be reported separately when aggregate metrics can hide them.
- Fallback behavior for unsupported or low-confidence languages MUST be defined.

## MUST NOT
- MUST NOT claim multilingual support solely because a base model accepts a language.
- MUST NOT apply English-specific token, casing, segmentation, or punctuation assumptions globally.
- MUST NOT route high-impact decisions through an unvalidated translation shortcut.

## SHOULD
- Evaluation SHOULD include code switching, dialects, mixed scripts, and locale-specific entities where relevant.
- Data allocation SHOULD consider both volume and linguistic difficulty.

## Exceptions
Any unsupported-language fallback requires explicit user/system behavior, risk assessment, and monitoring.

## Verification
Run per-language test suites, inspect token fragmentation and normalization, evaluate language-ID confusion, compare subgroup metrics, and review production error rates by language.