# Multilingual and Code-Switching Speech

## Purpose
Design speech systems that support multiple languages, accents, scripts, and code-switching without allowing high-resource languages to dominate evaluation or training.

## When to use
Use for multilingual ASR/TTS, global voice products, mixed-language conversations, and markets with frequent language switching.

## Inputs
- Language and accent inventory
- Per-language audio/text data
- Tokenizer or phoneme inventory
- Language-identification signals
- Per-language acceptance criteria

## Context to inspect
Inspect data imbalance, script differences, borrowed words, transliteration, language tags, pronunciation overlap, code-switch frequency, locale-specific normalization, and licensing by language.

## Core knowledge
Multilingual models share representations but can exhibit negative transfer and high-resource-language bias. Tokenization, normalization, phoneme coverage, and sampling policy materially affect low-resource performance. Code-switching requires evaluation at switch boundaries, not only per-language averages.

## Procedure
1. Define supported languages, locales, and switching scenarios.
2. Profile data volume and acoustic diversity per language.
3. Standardize language-specific transcript normalization.
4. Select shared versus language-specific tokenization/phoneme strategy.
5. Balance training sampling to prevent domination by large corpora.
6. Evaluate monolingual and code-switched subsets independently.
7. Inspect errors around language switches, names, numbers, and borrowed words.
8. Tune language-ID or language-conditioning behavior if used.
9. Test fallback behavior for unsupported or uncertain languages.
10. Track quality regressions independently for every supported locale.

## Decision points
Use one shared model when operational simplicity and cross-lingual transfer outweigh interference. Use specialized models when languages differ strongly or strict per-language quality is required. Language ID should gate routing only when its own error cost is acceptable.

## Common failure patterns
- Reporting only macro WER across languages
- Allowing English-heavy data to dominate batches
- Applying one normalization policy to all scripts
- Ignoring code-switch boundary errors
- Assuming accent equals language

## Verification
Verify per-language and per-accent metrics, code-switch accuracy, language-ID confusion, latency, and regression parity across supported locales.

## Expected output
A multilingual speech strategy with data balancing, representation choices, per-locale metrics, and documented fallback behavior.

## Stop conditions
Stop if a claimed supported language lacks enough representative evaluation data or quality cannot be measured separately from high-resource languages.