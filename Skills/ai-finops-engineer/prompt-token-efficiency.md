# Prompt and Token Efficiency

## Purpose
Reduce unnecessary model-token consumption while preserving task quality, safety, and maintainability.

## When to use
Use for LLM systems with large prompts, long outputs, repeated context, expensive reasoning modes, or rapidly growing token spend.

## Inputs
- Prompt templates and system instructions
- Input/output token distributions
- Task success metrics
- Cache behavior
- Retrieval/context payloads
- Model pricing

## Context to inspect
Inspect duplicated instructions, verbose retrieved context, conversation history, tool schemas, output limits, retries, and repeated static prefixes.

## Core knowledge
Token efficiency is not equivalent to prompt minimization. Removing context can reduce quality and increase retries. Optimize cost per successful task, not tokens in isolation.

## Procedure
1. Establish token distributions by endpoint and task class.
2. Identify the largest prompt and output contributors.
3. Separate static, dynamic, retrieved, and historical context.
4. Remove redundant or low-value context experimentally.
5. Compress structured context where semantics are preserved.
6. Tune output limits and stopping behavior.
7. Evaluate prompt caching or reusable prefixes.
8. Reduce retrieval payload using relevance and deduplication.
9. Compare model variants for context-heavy workloads.
10. Run regression evaluations after every material change.
11. Measure cost per successful task before and after.
12. Document token budgets and guardrails.

## Decision points
Use prompt caching for stable repeated prefixes when supported. Prefer retrieval filtering over arbitrary truncation. Keep additional context when it materially prevents failure or unsafe behavior.

## Common failure patterns
Blindly shortening system prompts, truncating evidence required for correctness, ignoring output-token costs, and moving cost from tokens into more retries.

## Verification
Verify task quality, safety checks, retry rate, latency, token usage, and total cost on representative workloads.

## Expected output
A token-efficiency profile, optimized prompt/context strategy, regression evidence, and realized unit-cost reduction.

## Stop conditions
Stop if savings require removing required safety instructions, confidential-context handling becomes weaker, or evaluation coverage is insufficient to detect regressions.