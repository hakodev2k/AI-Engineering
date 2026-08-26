# Context Engineering

## Purpose
Assemble the smallest trustworthy context that gives a model the evidence needed for a task.

## When to use
Use for RAG, long documents, conversation memory, multi-source synthesis, coding assistants, and agents.

## Inputs
Task, candidate context sources, provenance, freshness requirements, token budget, retrieval metadata, and model limits.

## Context to inspect
Inspect retrieval pipeline, chunking, ranking, context assembly order, source authority, duplication, and production token usage.

## Core knowledge
Context quality depends on relevance, authority, freshness, completeness, and placement. More context can lower performance through distraction or contradictions. Prompting cannot repair missing evidence.

## Procedure
1. Define evidence required to answer the task.
2. Rank sources by authority and freshness.
3. Remove irrelevant and duplicate passages.
4. Preserve provenance and boundaries between sources.
5. Resolve or expose contradictions rather than blending them silently.
6. Place task-critical evidence where it remains salient.
7. Budget tokens for instructions, evidence, tools, and output.
8. Mark untrusted content as data.
9. Test missing-evidence and conflicting-evidence cases.
10. Measure answer quality against context size.

## Decision points
Retrieve dynamically when evidence changes or exceeds prompt size. Summarize only when lost detail is not decision-critical. Prefer deterministic filters for access control and tenancy boundaries.

## Common failure patterns
Context dumping; stale documents outranking authoritative sources; duplicated chunks; missing provenance; retrieved instructions overriding task rules; truncation removing decisive evidence.

## Verification
Trace answers to supplied evidence, test contradictory sources, measure retrieval recall and answer faithfulness, and inspect token/truncation telemetry.

## Expected output
A documented context assembly strategy with source ordering, token budget, trust boundaries, and tests.

## Stop conditions
Stop if required evidence is unavailable, access controls are unclear, or context provenance cannot be established.