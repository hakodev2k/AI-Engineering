# Multimodal Retrieval

## Purpose
Design retrieval systems that search across text, images, audio, video, and documents using modality-aware representations, metadata, and ranking strategies.

## When to use
Use for multimodal search, retrieval-augmented generation, media discovery, duplicate detection, or grounding generative models in heterogeneous corpora.

## Inputs
Corpus, query modalities, embedding models, metadata, relevance judgments, latency and scale targets.

## Preconditions
Define retrieval intent, acceptable recall/precision trade-offs, and which modality combinations must be supported.

## Context to inspect
Inspect corpus size, modality distribution, embedding dimensions, metadata quality, update frequency, access controls, index technology, and downstream reranking.

## Core knowledge
Shared embedding spaces enable cross-modal retrieval but often have modality-specific calibration differences. Metadata filtering, lexical signals, modality-specific indexes, and reranking can outperform pure vector similarity. Retrieval evaluation must be query- and modality-specific.

## Procedure
1. Define supported query-to-corpus modality pairs.
2. Establish modality-specific and cross-modal baselines.
3. Choose embedding and normalization strategy.
4. Define chunking or segmentation for long media.
5. Index provenance and access-control metadata.
6. Add metadata filters before or during retrieval.
7. Select approximate-nearest-neighbor parameters for target recall.
8. Add lexical, structural, or temporal signals where useful.
9. Rerank top candidates with richer multimodal models when justified.
10. Build relevance judgments across representative query classes.
11. Tune thresholds and top-k on held-out data.
12. Monitor index freshness and embedding-version compatibility.

## Decision points
Use one shared index when embeddings are well calibrated across modalities; use separate indexes plus fusion when modality distributions differ materially. Add reranking when candidate recall is high but ordering quality is weak.

## Common failure patterns
Cross-modal score miscalibration; stale embeddings; permission leakage; poor media chunking; duplicate candidates; evaluating only text queries; index rebuilds without version compatibility.

## Verification
Measure Recall@K, precision, nDCG or task-specific success across modality pairs and query slices. Test access-control filtering and index freshness explicitly.

## Expected output
A versioned multimodal retrieval architecture with indexing, filtering, ranking, evaluation, and freshness controls.

## Stop conditions
Stop when relevance cannot be defined, source permissions cannot be enforced, or retrieval recall is insufficient for downstream use despite validated indexing and embeddings.