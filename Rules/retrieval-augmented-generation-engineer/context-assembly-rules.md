# Context Assembly Rules

## Purpose
Construct generation context from retrieved evidence without losing provenance, security constraints, or semantic coherence.

## Scope
Applies to candidate selection, deduplication, ordering, compression, context packing, and prompt-bound evidence formatting.

## MUST
- Context assembly MUST retain source identifiers and citation anchors for every included evidence unit.
- Duplicate or near-duplicate evidence MUST be controlled so repeated content does not dominate the context.
- Context selection MUST account for relevance, source trust, recency when relevant, and token budget.
- Restricted content MUST remain subject to authorization through the final assembled context.
- Truncation or compression MUST be observable and MUST NOT silently remove qualifiers that change meaning.
- Conflicting evidence MUST remain distinguishable rather than being silently merged into a false consensus.

## MUST NOT
- Unretrieved model knowledge MUST NOT be inserted into the evidence context and represented as source-backed content.
- Prompt instructions found inside retrieved documents MUST NOT automatically override system or application instructions.
- Low-relevance filler MUST NOT displace higher-value evidence solely due to source order.

## SHOULD
- Preserve document locality when neighboring chunks materially improve interpretation.
- Prefer compact evidence representations that preserve factual fidelity.
- Track context-utilization and dropped-candidate metrics for debugging.

## Exceptions
Exceptions require documented rationale, quality evidence, and risk analysis when they alter provenance, conflict handling, or security guarantees.

## Verification
Inspect assembled-context traces, token-budget tests, citation mapping, adversarial prompt-injection tests, conflict cases, and before/after answer-quality benchmarks.