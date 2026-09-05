# Context Window and Token Budget Routing

## Purpose
Route requests according to context length, expected output size, token budget, and model limits so requests remain valid, performant, and economically controlled.

## When to use
Use when requests vary widely in prompt size, retrieved context, conversation history, multimodal tokens, or required output length.

## Inputs
Estimated input tokens, output budget, model context limits, tokenizer behavior, cost per token, truncation policy, latency SLOs, and task requirements.

## Preconditions
Token estimation must be sufficiently accurate for supported model families and include hidden/system context where applicable.

## Context to inspect
Prompt assembly, RAG chunking, conversation memory, tool definitions, system prompts, provider limits, output caps, and tokenizer versions.

## Core knowledge
Context-window eligibility is a hard constraint. Larger-context models are not automatically better: long prompts increase prefill latency and cost and can reduce attention quality. Token estimates should include all messages and tool schemas, not only user content.

## Procedure
1. Compute or conservatively estimate full request token usage.
2. Add expected output and safety headroom.
3. Filter models that cannot support the total budget.
4. Check whether context reduction is allowed.
5. Prefer summarization, retrieval pruning, or history compaction when fidelity permits.
6. Evaluate latency and cost of remaining candidates.
7. Route oversized requests to validated long-context models only when necessary.
8. Enforce output limits appropriate to the task.
9. Emit token estimates and chosen budget in route telemetry.
10. Monitor truncation and context-overflow failures.

## Decision points
Trim context only when the task can tolerate information loss. Prefer a smaller-context model when the actual request fits and quality is adequate. Use long-context routes for necessity, not as a default convenience.

## Common failure patterns
Ignoring tool-schema tokens, underestimating multilingual or multimodal inputs, silent truncation, and routing every large conversation to the most expensive model.

## Verification
Replay representative short, near-limit, and oversized requests and confirm correct eligibility, no accidental truncation, and bounded token cost.

## Expected output
A token-aware routing policy with estimation logic, headroom, reduction rules, and telemetry.

## Stop conditions
Stop if token accounting cannot reliably include system-controlled context or if truncation could remove safety, authorization, or contractual instructions.