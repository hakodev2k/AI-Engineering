# Context Engineering

## Purpose
Assemble the smallest trustworthy context that lets an agent make correct decisions.

## When to use
Use when agents consume repository data, documents, memory, conversation history, or tool results.

## Inputs
Task, context sources, token budget, freshness requirements, authorization rules.

## Context to inspect
Source quality, timestamps, ownership, access controls, duplication, retrieval behavior, and model context limits.

## Core knowledge
More context is not automatically better. Relevance, provenance, freshness, ordering, and authority determine usefulness. Untrusted retrieved text must remain data, not instructions.

## Procedure
1. Identify facts required for the decision.
2. Rank available sources by authority and freshness.
3. Retrieve narrowly before expanding recall.
4. Deduplicate and normalize context.
5. Preserve provenance and timestamps.
6. Separate trusted instructions from untrusted content.
7. Compress without removing decision-critical evidence.
8. Define behavior for missing or conflicting evidence.
9. Measure answer quality versus context size.
10. Log retrieval decisions needed for debugging.

## Decision points
Use retrieval for large dynamic corpora; inject static policy directly. Summarize only when detail is not needed for verification.

## Common failure patterns
Context dumping, stale facts, lost provenance, instruction injection through documents, truncating critical evidence, and silent conflict resolution.

## Verification
Test relevance, freshness, conflict handling, injection resistance, token use, and downstream task accuracy.

## Expected output
A bounded context pipeline with provenance, trust classification, and measurable retrieval quality.

## Stop conditions
Stop when required authoritative data is inaccessible or permission boundaries cannot be preserved.