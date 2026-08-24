# Multilingual Search

## Purpose
Preserve search quality across languages, scripts, locales, and mixed-language queries.

## Scope
Language detection, analyzers, normalization, transliteration, stemming, tokenization, and cross-lingual retrieval.

## MUST
- Evaluate language-specific analysis on languages materially supported by the product.
- Preserve identifiers, code, names, and tokens where linguistic normalization would corrupt meaning.
- Define locale-sensitive behavior for case, diacritics, segmentation, dates, and sorting where applicable.
- Test mixed-script and mixed-language queries when they occur in target usage.

## MUST NOT
- Apply an English-centric analyzer globally without evidence.
- assume Unicode normalization alone solves linguistic equivalence.
- silently translate queries when translation can change intent without measured safeguards.

## SHOULD
- Maintain language-segmented relevance metrics.
- Prefer explicit fallback behavior for unsupported languages.

## Exceptions
Exceptions require supported-language scope, known degradation, user impact, and review.

## Verification
Run language-specific golden queries, analyzer tests, multilingual judgments, locale boundary tests, and segmented metrics.