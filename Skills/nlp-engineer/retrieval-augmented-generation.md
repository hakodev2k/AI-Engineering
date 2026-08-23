# Retrieval-Augmented Generation

## Purpose
Build RAG systems whose answers are grounded in authorized evidence, measurable for retrieval and generation quality, and resilient to missing or conflicting context.

## When to use
Use when generation must depend on changing/private corpora or cite source evidence.

## Inputs
Corpus, query set, retriever, generator, access rules, answer policy, latency/cost targets.

## Preconditions
Source documents can be indexed and retrieval relevance can be evaluated independently.

## Context to inspect
Chunking, metadata, ACLs, retrieval metrics, prompt format, citation requirements, context limits, hallucination failures.

## Core knowledge
RAG combines at least two error channels: evidence retrieval and answer synthesis. Generation cannot recover facts absent from retrieved context, and retrieved text can itself be malicious or contradictory.

## Procedure
1. Define answerability and refusal policy.
2. Establish retrieval benchmark and baseline.
3. Design chunking and metadata around semantic units.
4. Enforce permissions before context reaches the model.
5. Construct context with source identifiers and bounded token budget.
6. Prompt the generator to distinguish evidence from instructions.
7. Evaluate retrieval recall separately from grounded answer quality.
8. Test insufficient, conflicting, stale, and adversarial sources.
9. Add citations and verify citation entailment where required.
10. Measure end-to-end latency, cost, and failure rates.

## Decision points
Use reranking when retrieval order is weak; query expansion when recall is weak; structured extraction instead of RAG when output can be deterministically derived.

## Common failure patterns
Evaluating only final answers, post-filter ACLs, oversized chunks, trusting retrieved instructions, fabricated citations, and answering when evidence is absent.

## Verification
Retrieval benchmark, grounded-answer evaluation, citation checks, ACL tests, and adversarial cases pass.

## Expected output
RAG pipeline, answer policy, evaluation suite, source/citation contract, and operating thresholds.

## Stop conditions
Stop if source permissions cannot be enforced or required claims cannot be reliably grounded.