# Chunking Strategy Rules

## Purpose
Define chunking policies that preserve semantic coherence and support reliable retrieval, citations, and downstream context assembly.

## Scope
Applies to segmentation of normalized documents into retrievable units, including overlap, hierarchy, metadata inheritance, and re-chunking.

## MUST
- Chunk boundaries MUST be based on document structure or semantic continuity rather than arbitrary character counts alone when structure is available.
- Each chunk MUST retain source identity, parent document identity, structural location, and authorization metadata required at query time.
- Chunking changes MUST be evaluated against retrieval quality before production rollout.
- Overlap MUST be justified by measured benefit and MUST NOT create uncontrolled duplicate evidence.
- Chunk sizes MUST account for embedding behavior, retrieval granularity, context-window constraints, and expected query types.
- Re-chunking MUST define how stale chunks are removed or replaced to prevent mixed generations of the same source.

## MUST NOT
- Chunking MUST NOT split critical semantic units such as table rows, code blocks, clauses, or tightly coupled instructions without a reconstruction strategy.
- Chunks MUST NOT inherit metadata that is broader than the source's actual access or classification scope.
- A single chunking configuration MUST NOT be assumed optimal across materially different document classes without evidence.

## SHOULD
- Chunking SHOULD preserve hierarchical parent-child relationships when useful for retrieval or answer grounding.
- Multiple chunking strategies SHOULD be considered for heterogeneous corpora.
- Chunking experiments SHOULD report relevance, citation precision, latency, and index-size effects.

## Exceptions
Exceptions require documented corpus constraints, test evidence, risk assessment, and reviewer approval when they affect authorization or citation fidelity.

## Verification
Verify with retrieval benchmarks, boundary inspections, duplicate-rate metrics, stale-chunk tests, representative query sets, and source-to-chunk traceability checks.