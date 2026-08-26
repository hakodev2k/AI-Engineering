# Query Understanding and Rewriting

## Purpose
Transform user requests into retrieval queries without changing intent or silently inventing constraints.

## When to use
Use for conversational references, verbose questions, acronyms, multi-part requests, or vocabulary mismatch.

## Inputs
Current query, permitted conversation context, domain vocabulary, retrieval capabilities, evaluation cases.

## Context to inspect
Inspect prior turns relevant to references, known entity dictionaries, query logs, zero-result cases, and security scope.

## Core knowledge
Rewriting can improve recall but can also introduce hallucinated entities or erase critical exact terms. Original query information should remain recoverable and observable.

## Procedure
1. Detect ambiguity, references, compound intent, and exact tokens.
2. Preserve identifiers, quoted terms, dates, and negations.
3. Resolve conversational references only from available evidence.
4. Generate minimal retrieval-oriented reformulation.
5. Optionally decompose genuinely multi-hop questions.
6. Retain original query for parallel retrieval or auditing.
7. Apply user and authorization filters independently of rewriting.
8. Evaluate rewrites against baseline retrieval.
9. Log rewrite decisions without sensitive leakage.
10. Disable rewriting for segments where it degrades quality.

## Decision points
Use deterministic normalization for predictable transformations. Use model-based rewriting when semantic interpretation adds measured value and can be bounded.

## Common failure patterns
Dropping negation; replacing exact codes; resolving pronouns incorrectly; adding facts not stated; using rewrite as authorization logic.

## Verification
Run intent-preservation tests and compare retrieval metrics across ambiguous, exact-term, and conversational slices.

## Expected output
A controlled rewrite policy with measurable retrieval benefit and traceability.

## Stop conditions
Stop or return the original query when intent cannot be resolved without unsupported assumptions.