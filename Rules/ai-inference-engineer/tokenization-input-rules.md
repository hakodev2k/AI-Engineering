# Tokenization and Input Rules

## Purpose
Ensure requests are normalized, tokenized, bounded, and interpreted consistently before inference.

## Scope
Tokenizers, templates, normalization, truncation, special tokens, context limits, multimodal preprocessing, and validation.

## MUST
- Production deployments MUST bind models to the tokenizer and preprocessing versions they were validated with.
- Input limits MUST be enforced before expensive model execution.
- Truncation behavior MUST be explicit and observable to consumers where it can change semantics.
- Special-token and prompt-template behavior MUST be versioned with the model contract.
- Multimodal preprocessing MUST validate supported formats, dimensions, and resource limits.

## MUST NOT
- MUST NOT silently substitute a different tokenizer or chat template for an existing model version.
- MUST NOT accept unbounded input sizes.
- MUST NOT rely on client-side validation as the sole enforcement layer.

## SHOULD
- Token counts SHOULD be computed early enough to support admission control and cost estimation.
- Preprocessing SHOULD be deterministic for equivalent inputs.

## Exceptions
Alternative preprocessing requires compatibility evidence, quality validation, and approval.

## Verification
Inspect model metadata, tokenizer hashes, request-validation tests, truncation tests, and preprocessing fixtures.