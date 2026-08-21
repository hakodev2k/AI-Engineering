# Research — Context Summarization Overflow Budget Guard

## Topic
Context Summarization Overflow Budget Guard

## Category
Token

## Problem
Agents can trigger summarization only when history is already near a model limit. The summarization call adds prompt text, structured metadata, tool-call payloads, usage metadata, and output headroom, so the summarizer can overflow even when visible conversation text appears to fit.

## Why it matters now
LangChain issue #34517 documented `SummarizationMiddleware` metadata pushing summarization over context limits. LangMem currently warns that failed trimming can fall back to the original message list and potentially exceed the summarization model context. LangChain documentation recommends trimming/summarization for long conversations, making full-envelope budget accounting a practical requirement.

## Affected users
Builders of long-running agents, tool-heavy conversations, RAG pipelines, multi-agent transcripts, and middleware that summarizes state near context limits.

## Current public evidence
1. LangChain issue #34517: https://github.com/langchain-ai/langchain/issues/34517
2. LangMem summarization implementation and overflow warning: https://github.com/langchain-ai/langmem/blob/main/src/langmem/short_term/summarization.py
3. LangChain short-term-memory context-management docs: https://github.com/langchain-ai/docs/blob/main/src/oss/langchain/short-term-memory.mdx
4. LangChain context-fixing examples: https://github.com/langchain-ai/how_to_fix_your_context

## Existing approaches
Fixed summarization thresholds, approximate token counting, keep-recent-N, trimming, tool-output summarization, and external memory.

## Remaining limitations
Thresholds may exclude summarizer prompt/output reserve. Approximate counters can undercount structured metadata. Generic trimming can split tool-call/result pairs or discard verification-critical facts. Fallback-to-original behavior can reintroduce overflow. Compression is often measured only in tokens, not context retention.

## Root-cause analysis
Budget is based on conversation content rather than the complete summarization envelope; structured metadata has hidden cost; output reserve/safety margin may not be deducted; required state is not explicitly non-evictable; and overflow retries can reuse effectively the same payload.

## Improvement opportunity
Estimate the full envelope before summarization, strip non-essential metadata, preserve required message/tool pairs, and block or progressively trim before the model call.

## Goal
Reduce summarization overflow and token waste without losing correctness-critical context.

## Metrics
Input tokens, output reserve, utilization ratio, stripped metadata size, overflow rate, compression ratio, required-context retention, quality regression, latency, and cost/task.

## Trigger
Before every summarization/compaction request and whenever projected utilization exceeds policy threshold.

## Inputs
Messages, required IDs, summary-prompt token estimate, context limit, output reserve, safety margin, metadata policy.

## Outputs
Allow/trim/block decision, selected messages, stripping report, projected budget, retained required IDs, verification record.

## Observed evidence
Current libraries explicitly document overflow cases and fallback risks around summarization near context limits.

## Interpretation
Summarization is itself a context-consuming model call; treating it as free compression creates a budget race near the boundary.

## Proposed solution
A full-envelope budget gate with deterministic metadata stripping, pair-preserving trimming, required-context retention, bounded retries, and quality verification.
