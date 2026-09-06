# Hallucination and Groundedness Testing

## Purpose
Measure whether generated claims are supported by authoritative context or verifiable facts, and whether the system abstains appropriately when evidence is insufficient.

## When to use
Use for factual assistants, RAG systems, enterprise copilots, summarizers, research tools, and decision-support systems.

## Inputs
Prompts, source context, authoritative references, expected claims, abstention policy, and representative queries.

## Preconditions
The evaluation can distinguish supported, unsupported, contradicted, and unverifiable claims.

## Context to inspect
Inspect retrieval context, system instructions, citations, temporal scope, source authority, and post-processing.

## Core knowledge
Hallucination is often claim-level. An answer may be mostly correct but contain one unsupported high-impact assertion. Groundedness should therefore be assessed per material claim, not only per response.

## Procedure
1. Define authoritative evidence and temporal cutoff.
2. Build cases with sufficient, insufficient, conflicting, and absent evidence.
3. Decompose responses into material factual claims.
4. Classify each claim as supported, contradicted, unsupported, or unverifiable.
5. Verify citations actually entail the claims they accompany.
6. Measure response-level and claim-level groundedness.
7. Test expected abstention when evidence is inadequate.
8. Prioritize high-impact unsupported claims separately.
9. Compare candidate changes against baseline.
10. Add confirmed failure patterns to regression tests.

## Decision points
Use automated entailment or judge models for scale only after calibration. Require human review for high-stakes facts or ambiguous evidence.

## Common failure patterns
Treating citations as proof without checking them, averaging away severe claims, using stale sources, and rewarding confident answers when abstention is correct.

## Verification
Confirm claim labels against authoritative evidence and manually audit severe unsupported or contradicted claims.

## Expected output
A groundedness report with claim-level error rates, citation failures, abstention results, and protected regression cases.

## Stop conditions
Stop when source authority is undefined or required evidence cannot legally or operationally be accessed.