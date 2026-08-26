# Multi-Hop Retrieval and Query Decomposition

## Purpose
Answer questions requiring evidence from multiple documents or retrieval steps without uncontrolled agentic search.

## When to use
Use when a single retrieval query consistently cannot gather all necessary evidence for compositional questions.

## Inputs
Complex question, corpus relationships, retrieval interface, evidence budget, evaluation examples, latency limits.

## Context to inspect
Inspect whether questions truly require multiple hops, entity links, intermediate evidence, ambiguity, and failure traces from single-pass retrieval.

## Core knowledge
Decomposition can improve coverage but multiplies latency and opportunities for error. Intermediate hypotheses must not be treated as facts unless grounded. Bound the number of retrieval steps.

## Procedure
1. Determine whether the question is decomposable into independently retrievable subquestions.
2. Preserve the original goal and constraints.
3. Generate minimal subqueries without inventing facts.
4. Retrieve evidence for each subquery with normal ACL enforcement.
5. Resolve entities from evidence before dependent hops.
6. Track provenance for every intermediate claim.
7. Stop when evidence is sufficient or hop budget is exhausted.
8. Assemble non-duplicative evidence.
9. Generate the final answer only from supported intermediate facts.
10. Evaluate against a single-pass baseline for quality, latency, and cost.

## Decision points
Prefer single-pass retrieval when it meets quality. Use decomposition for genuine compositional dependencies, not as a universal complexity layer.

## Common failure patterns
Unbounded loops; hallucinated intermediate entities; repeated equivalent queries; authorization scope changing between hops; cost explosion.

## Verification
Test hop limits, provenance, unsupported intermediate claims, latency, and end-to-end correctness on multi-hop cases.

## Expected output
A bounded decomposition workflow with traceable evidence across hops.

## Stop conditions
Stop and abstain when a required intermediate fact cannot be grounded within the allowed retrieval budget.