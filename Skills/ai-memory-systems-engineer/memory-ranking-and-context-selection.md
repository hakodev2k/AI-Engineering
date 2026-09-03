# Memory Ranking and Context Selection

## Purpose
Rank retrieved memories and select a bounded context set that maximizes usefulness while minimizing distraction, contradiction, latency, and token cost.

## When to use
Use after candidate retrieval when too many memories compete for limited model context.

## Inputs
Retrieved candidates, relevance signals, timestamps, confidence, provenance, task intent, token budget.

## Preconditions
Candidates must already satisfy authorization and basic validity checks.

## Context to inspect
Prompt structure, model context limits, memory lengths, retrieval scores, user corrections, and answer-quality traces.

## Core knowledge
More context can reduce model quality. Ranking should reflect task relevance, confidence, freshness, specificity, and diversity, not only semantic similarity.

## Procedure
1. Estimate context budget available for memory.
2. Score candidates for relevance and validity.
3. Penalize stale, redundant, or low-confidence memories.
4. Preserve critical explicit user preferences where applicable.
5. Diversify across distinct facts or episodes.
6. Resolve or flag contradictions.
7. Compress only when provenance can be preserved.
8. Select memories within the budget.
9. Record why each memory was included or excluded.
10. Evaluate downstream task quality and token cost.

## Decision points
Prefer fewer high-confidence memories for precision-critical tasks. Use broader episodic context when the task requires narrative continuity.

## Common failure patterns
Top-k by vector score only; including redundant memories; dropping explicit facts in favor of inferred summaries; no token budget.

## Verification
Compare answer quality and retrieval precision with and without ranking across representative tasks.

## Expected output
A bounded, explainable memory-context selection policy.

## Stop conditions
Stop when contradictions materially affect the task and cannot be resolved from provenance or user confirmation.