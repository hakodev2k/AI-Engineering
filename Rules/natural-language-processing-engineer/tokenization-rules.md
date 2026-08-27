# Tokenization Rules

## Purpose
Control token boundaries and vocabulary behavior as explicit model interfaces.

## Scope
Subword tokenizers, vocabulary construction, special tokens, truncation, padding, offsets, and tokenizer upgrades.

## MUST
- Tokenizer artifact, vocabulary, special-token IDs, normalization, and version MUST be bound to the model version.
- Training, evaluation, and serving MUST use compatible tokenizer artifacts.
- Truncation and padding policies MUST be explicit and tested on boundary lengths.
- Token-to-character alignment MUST be validated for span-sensitive tasks.

## MUST NOT
- MUST NOT change vocabulary or special-token semantics without compatibility analysis and model-impact validation.
- MUST NOT assume whitespace tokenization is linguistically safe across languages.
- MUST NOT silently truncate inputs whose omitted region can alter required decisions.

## SHOULD
- Vocabulary design SHOULD be evaluated for fragmentation, unknown handling, multilingual fairness, and sequence inflation.
- Tokenizer changes SHOULD report distribution shifts in token counts and task metrics.

## Exceptions
Any incompatibility requires a migration plan, evidence, rollback strategy, and approval before production rollout.

## Verification
Compare tokenizer hashes, special-token mappings, multilingual golden cases, sequence-length distributions, offset round trips, and train/serve artifact identity in CI.