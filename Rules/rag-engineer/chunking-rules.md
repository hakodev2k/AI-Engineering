# Chunking Rules

## Purpose
Preserve semantic usefulness while creating retrieval units.

## Scope
Segmentation, overlap, structural boundaries, chunk metadata, and hierarchical chunking.

## MUST
- Chunking strategy MUST be chosen using corpus structure and retrieval evidence.
- Chunks MUST preserve enough source metadata to reconstruct document context.
- Structural boundaries such as headings, sections, tables, or records MUST be respected when they carry meaning.
- Chunk-size changes MUST be evaluated for retrieval quality, latency, and index cost.

## MUST NOT
- MUST NOT use one arbitrary chunk size across materially different content types without validation.
- MUST NOT create overlapping chunks that cause uncontrolled duplication or ranking bias.
- MUST NOT detach chunks from authorization-relevant parent metadata.

## SHOULD
- Prefer semantic or structure-aware boundaries over blind fixed windows when practical.
- Test multiple chunking strategies on representative queries.

## Exceptions
Simple fixed-size chunking is acceptable when evidence shows no meaningful quality loss.

## Verification
Review chunk samples, boundary tests, duplication rates, retrieval evaluation results, and metadata integrity.