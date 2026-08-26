# ASR Decoding and Language Modeling

## Purpose
Optimize ASR decoding so acoustic evidence, lexical constraints, and language priors produce useful transcripts without masking model defects.

## When to use
Use when tuning beam search, language-model fusion, contextual biasing, hotwords, or decoding latency.

## Inputs
Model emissions, tokenizer, dev set, language model if any, vocabulary/context phrases, latency budget.

## Context to inspect
Inspect decoder defaults, score scales, pruning, blank behavior, text normalization, and error categories.

## Core knowledge
Beam width, LM weight, insertion penalties, pruning and contextual biasing affect error trade-offs. Decoder tuning must remain separated from final test evaluation.

## Procedure
1. Freeze acoustic model and evaluation normalization.
2. Establish greedy or default-decoder baseline.
3. Categorize errors affected by decoding.
4. Sweep decoder parameters on development data.
5. Measure accuracy and compute jointly.
6. Add contextual biasing only for justified domains.
7. Test adversarial context and silence behavior.
8. Lock parameters before test evaluation.

## Decision points
Use larger beams only while marginal accuracy exceeds latency cost. Prefer contextual biasing over global LM changes for narrow dynamic vocabularies.

## Common failure patterns
Over-biasing hotwords, test-set tuning, unbounded beam growth, duplicated tokens, and hiding poor acoustic modeling with language priors.

## Verification
Compare WER components, rare-term recall, false insertions, real-time factor, and tail latency against baseline.

## Expected output
A reproducible decoder configuration with documented trade-offs.

## Stop conditions
Stop when decoding changes cannot meet latency limits or materially increase hallucinated/incorrect text.