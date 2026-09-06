# Chunking and Segmentation Rules

## Purpose
Preserve semantic coherence when dividing source material for retrieval and context assembly.

## Scope
Chunk boundaries, overlap, metadata inheritance, structural parsing, and semantic segmentation.

## MUST
- Chunking MUST preserve enough local context to interpret the extracted passage correctly.
- Structural boundaries such as headings, tables, code blocks, and records MUST be respected when their separation would alter meaning.
- Chunk metadata MUST retain source identity and location.
- Overlap MUST be bounded and justified by retrieval quality.
- Chunk-size changes MUST be evaluated on representative retrieval tasks.

## MUST NOT
- MUST NOT split identifiers, code constructs, table rows, or statements in ways that create misleading fragments.
- MUST NOT duplicate large overlaps that waste context without measured benefit.
- MUST NOT discard source-location metadata required for verification.

## SHOULD
- Prefer structure-aware chunking over fixed-size slicing for heterogeneous documents.
- Tune chunk size using measured retrieval and answer quality.

## Exceptions
Exceptions require task-specific evidence and documented trade-offs.

## Verification
Inspect parsed chunks, boundary tests, retrieval metrics, and context snapshots.