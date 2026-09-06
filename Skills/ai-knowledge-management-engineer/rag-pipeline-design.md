# RAG Pipeline Design

## Purpose
Design retrieval-augmented generation pipelines that ground model outputs in authoritative knowledge while controlling context, latency, cost, and failure behavior.

## When to use
Use when building or redesigning enterprise Q&A, research assistants, support copilots, or grounded generation workflows.

## Inputs
User tasks, corpus, retrievers, model candidates, context budget, citation requirements, authorization rules, latency targets, and evaluation data.

## Context to inspect
Inspect query preprocessing, retrieval stages, ranking, context assembly, prompts, model settings, tool calls, citations, fallback behavior, and production traces.

## Core knowledge
RAG quality is a pipeline property. Retrieval recall, source authority, context ordering, prompt instructions, model behavior, and citation mapping interact. More context is not always better; irrelevant evidence can lower answer quality.

## Procedure
1. Define supported question types and unsupported cases.
2. Establish retrieval and generation quality baselines separately.
3. Design query rewriting only where it improves recall without changing intent.
4. Retrieve permission-safe candidates and rank for relevance and authority.
5. Assemble context within budget while preserving source boundaries and citation IDs.
6. Instruct the model to distinguish evidence, inference, uncertainty, and missing information.
7. Define abstention and fallback rules when evidence is insufficient.
8. Preserve end-to-end traceability from answer claims to source chunks.
9. Evaluate retrieval, groundedness, correctness, citation accuracy, latency, and cost.
10. Add regression tests and production monitoring before rollout.

## Decision points
Use single-pass RAG for straightforward lookup, iterative retrieval for decomposition-heavy questions, and structured tools instead of text retrieval when authoritative data is transactional or exact.

## Common failure patterns
Treating RAG as prompt engineering, stuffing too many chunks, citing irrelevant sources, retrieving stale replicas, ignoring access filters, and forcing answers when evidence is absent.

## Verification
Run end-to-end evaluations with known-answer and no-answer cases. Confirm evidence supports claims, citations resolve correctly, permissions hold, and latency/cost stay within targets.

## Expected output
A production RAG design with retrieval stages, context policy, grounding rules, fallbacks, metrics, and test evidence.

## Stop conditions
Stop when authoritative sources cannot be identified, permission filtering is unsafe, or the use case requires deterministic correctness that free-form generation cannot provide.