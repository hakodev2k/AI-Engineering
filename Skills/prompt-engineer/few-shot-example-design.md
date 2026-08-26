# Few-Shot Example Design

## Purpose
Select and author examples that teach task boundaries and difficult distinctions without causing brittle imitation.

## When to use
Use when instructions alone leave ambiguity, labels are subtle, formatting is non-obvious, or error analysis shows systematic confusion.

## Inputs
Task contract, representative dataset, failure cases, token budget, output schema, and target model.

## Context to inspect
Review production input distribution, current examples, eval failures, class balance, and prompt token cost.

## Core knowledge
Examples act as behavioral evidence. Coverage and contrast matter more than quantity. Examples can introduce positional, stylistic, label-frequency, and lexical bias.

## Procedure
1. Identify ambiguities examples must resolve.
2. Select representative rather than merely easy cases.
3. Include boundary and contrastive examples where labels are confusable.
4. Keep examples internally consistent with the written contract.
5. Remove irrelevant details that may become spurious cues.
6. Balance labels when frequency should not imply a prior.
7. Use the exact production output format.
8. Test with examples reordered and partially removed.
9. Compare against zero-shot baseline on held-out cases.
10. Retain only examples with measurable value.

## Decision points
Use few-shot prompting when examples improve held-out behavior enough to justify tokens. Prefer retrieval/dynamic examples when input domains vary substantially. Prefer fine-tuning when a large stable behavior pattern cannot fit economically in context.

## Common failure patterns
Examples contradict instructions; all examples are happy paths; answer leakage; copying sensitive production data; overfitting eval cases; assuming more examples always help.

## Verification
Run held-out evaluations, order-sensitivity tests, token/cost comparison, and regression tests for classes not represented in examples.

## Expected output
A minimal example set with documented purpose and evidence of improvement.

## Stop conditions
Stop if representative data cannot be used legally/safely, examples reduce held-out quality, or task semantics remain unresolved.