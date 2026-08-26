# Production Debugging and Root Cause Analysis

## Purpose
Diagnose incorrect, missing, stale, slow, or unauthorized RAG answers systematically.

## When to use
Use for production incidents, regressions, unexplained user reports, and quality degradation.

## Inputs
Incident description, request IDs, traces, index/model versions, source records, retrieved candidates, generated output, deployment history.

## Context to inspect
Inspect each pipeline stage and recent changes; do not infer the root cause from the final answer alone.

## Core knowledge
RAG failures propagate across stages. The same bad answer can originate from missing corpus data, parser corruption, stale indexing, query rewriting, filtering, ranking, context assembly, or generation.

## Procedure
1. Define impact, affected segment, and first known occurrence.
2. Capture reproducible request evidence and versions.
3. Verify authoritative source content first.
4. Trace source through ingestion, parsing, chunks, index, retrieval, reranking, context, and generation.
5. Identify the earliest stage where expected behavior diverges.
6. Compare with a known-good request or previous version.
7. Form a falsifiable root-cause hypothesis.
8. Test the smallest safe change.
9. Mitigate user impact before broad optimization.
10. Add a regression case to evaluation.
11. Document cause, contributing factors, and prevention.

## Decision points
Rollback when a recent change has broad impact and rollback risk is lower than continued exposure. Reindex only when evidence shows index/corpus inconsistency.

## Common failure patterns
Prompt tweaking before checking retrieval; destructive reindex during incident; no version metadata; treating symptoms as root cause; debugging only successful traces.

## Verification
Reproduce the failure before the fix, demonstrate the corrected trace after it, and pass targeted plus broader regression tests.

## Expected output
An evidence-backed root cause, mitigation, durable fix, and regression protection.

## Stop conditions
Stop risky production changes when access, backups, ownership, or blast radius is uncertain.