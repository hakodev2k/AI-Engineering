# Production Retrieval Troubleshooting

## Purpose
Diagnose production knowledge failures systematically across ingestion, parsing, indexing, filtering, ranking, caching, and generation instead of guessing from the final answer.

## When to use
Use when relevant content is missing, stale, duplicated, unauthorized, poorly ranked, or cited incorrectly in production.

## Inputs
Incident report, user query, identity context, retrieval trace, source object, ingestion state, index records, ranking scores, model trace, and recent changes.

## Context to inspect
Inspect source availability, connector checkpoints, parser output, chunk lineage, embedding/index versions, ACL filters, query rewrites, candidate lists, reranker scores, cache keys, and deployment history.

## Core knowledge
Final answer symptoms can originate upstream. Troubleshooting should follow data lineage from source to response and compare expected versus observed state at each boundary. Preserve evidence before rerunning mutable pipelines.

## Procedure
1. Capture the exact query, user context, timestamp, and observed result.
2. Determine the expected authoritative source and version.
3. Verify the source object exists and the user can access it.
4. Trace ingestion, normalization, chunking, and indexing state using stable IDs.
5. Confirm the relevant chunk is present in the active index version.
6. Reproduce retrieval with the same filters and query transformation.
7. Inspect lexical/vector candidates, fusion, and reranking.
8. Check cache behavior and stale result reuse.
9. If retrieval is correct, inspect context assembly and generation separately.
10. Identify the earliest failing boundary and formulate the smallest safe correction.
11. Add a regression test and validate after remediation.

## Decision points
Rollback when a recent deployment causes broad regressions; repair data when the defect is isolated to source or ingestion state. Avoid reindexing the full corpus until scope is known.

## Common failure patterns
Tuning prompts before checking retrieval, debugging with privileged identities, losing the original trace, clearing caches without evidence, and treating a single successful retry as resolution.

## Verification
Reproduce the original failure before the fix, verify the corrected path with identical conditions, and check neighboring cases for regression.

## Expected output
A root-cause record with failing boundary, evidence, remediation, verification, and preventive action.

## Stop conditions
Stop when production access exceeds authorization, evidence has been destroyed, or remediation would require destructive index or source changes without approval.