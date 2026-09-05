# Skill: Discover Embedding Contract

## Purpose
Identify the real compatibility contract between embedding generation and vector retrieval.

## Inputs
Repository, runtime config, vector-store metadata, embedding model configuration.

## Process
1. Locate embedding creation entry points.
2. Locate query-time embedding entry points.
3. Identify provider, model, revision, requested dimensions, normalization, and retry/fallback behavior.
4. Identify vector-store collection/index namespace and configured metric.
5. Trace chunking/version identity used when vectors are produced.
6. Confirm whether document and query embeddings use the same vector space.
7. Capture `index_generation` and whether all records belong to that generation.
8. Produce a manifest backed by repository/config/store evidence.
9. Mark unknown values as blocking rather than guessing.

## Verification
Every manifest value must point to reproducible repository/config/vector-store evidence.

## Failure handling
Metadata/tool reads may retry twice if transient. Permission failures or unknown model identity stop the workflow.
