# Memory Evaluation

## Purpose
Measure whether memory improves downstream AI behavior while controlling false memories, stale retrieval, privacy harm, and unnecessary context.

## When to use
Use before launches, after extraction or retrieval changes, and when memory-related regressions are suspected.

## Inputs
Representative interactions, labeled memory candidates, retrieval judgments, downstream tasks, production traces, risk taxonomy.

## Preconditions
Define memory success independently from general model quality.

## Context to inspect
Extraction outputs, stored records, retrieval rankings, prompts, answers, user corrections, latency, and token usage.

## Core knowledge
Memory systems require layered evaluation: extraction precision/recall, storage correctness, retrieval relevance, temporal correctness, and task-level impact. A good retrieval score can still harm final answers.

## Procedure
1. Build representative test scenarios.
2. Label what should and should not be remembered.
3. Measure extraction precision and recall.
4. Measure conflict and stale-memory rates.
5. Evaluate retrieval precision, recall, and ranking.
6. Compare downstream answers with and without memory.
7. Test privacy and isolation failures separately.
8. Segment results by memory type and age.
9. Track latency and token overhead.
10. Set regression gates for releases.

## Decision points
Use human judgment for nuanced usefulness and automated checks for deterministic invariants. Prefer task-level metrics when component metrics disagree.

## Common failure patterns
Evaluating only retrieval similarity; no negative tests; cherry-picked conversations; ignoring memory harm; no baseline without memory.

## Verification
A change is verified only when component and downstream metrics meet thresholds on held-out scenarios and critical safety tests pass.

## Expected output
A reproducible memory evaluation suite and release-quality report.

## Stop conditions
Stop when evaluation examples are not representative enough to justify production decisions.