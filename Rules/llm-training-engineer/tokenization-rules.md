# Tokenization Rules

## Purpose
Protect model compatibility, data efficiency, and reproducibility at the tokenizer boundary.

## Scope
Tokenizer training, vocabulary changes, normalization, special tokens, chat/control tokens, and encoded training shards.

## MUST
- Tokenizer identity and configuration MUST be immutable and versioned for each checkpoint lineage.
- Special-token IDs and semantics MUST be documented and validated across preprocessing, training, inference, and evaluation.
- Tokenizer changes for continued training MUST undergo compatibility analysis with existing embeddings and serving systems.
- Encoding quality MUST be measured across important languages, code, structured text, and long-tail symbols relevant to deployment.
- Tokenized shards MUST record the tokenizer version used.

## MUST NOT
- MUST NOT reuse an old tokenizer identifier for changed vocabulary or normalization behavior.
- MUST NOT introduce overlapping or ambiguous control-token semantics.
- MUST NOT compare token-based compute or context metrics across tokenizers without accounting for changed segmentation.

## SHOULD
- Tokenizer evaluation SHOULD include fertility, byte fallback behavior, normalization edge cases, and round-trip tests.
- New vocabularies SHOULD be justified by measurable efficiency or capability gains.

## Exceptions
Compatibility-breaking changes require explicit migration design and approval for any affected checkpoint or API contract.

## Verification
Run tokenizer golden tests, inspect vocabulary hashes and special-token maps, compare segmentation statistics, and verify training/inference configurations reference the same version.