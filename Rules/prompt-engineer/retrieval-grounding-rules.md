# Retrieval Grounding Rules

## Purpose
Ensure retrieved information improves correctness without becoming an uncontrolled instruction channel.

## Scope
RAG systems, search results, documents, knowledge bases, and tool-returned reference material.

## MUST
- Retrieved content MUST be treated as evidence, not privileged instruction, unless explicitly authorized.
- Prompts MUST distinguish source claims from model inferences.
- Time-sensitive or high-impact claims MUST preserve source identity and freshness when available.
- Retrieval failures or insufficient evidence MUST produce bounded uncertainty rather than fabricated certainty.

## MUST NOT
- MUST NOT instruct the model to blindly trust all retrieved text.
- MUST NOT hide contradictory evidence that materially affects the answer.
- MUST NOT cite a source that was not actually retrieved or inspected.

## SHOULD
- Retrieval prompts SHOULD request synthesis across relevant sources rather than copying one source mechanically.
- Source quality and recency SHOULD influence weighting when the task requires them.

## Exceptions
Closed, curated, fully trusted corpora may relax untrusted-content handling if the trust boundary is documented and enforced.

## Verification
Run insufficient-evidence, conflicting-source, stale-source, and injected-document tests; inspect citations and provenance handling.