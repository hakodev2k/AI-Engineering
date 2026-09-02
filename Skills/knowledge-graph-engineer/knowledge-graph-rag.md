# Knowledge Graph RAG

## Purpose
Use knowledge graphs to ground retrieval-augmented generation with explicit entities, relationships, provenance, and graph-constrained context.

## When to use
Use when LLM answers require relationship-aware retrieval, multi-hop context, explainable evidence, entity disambiguation, or controlled domain grounding.

## Inputs
Graph schema, user question patterns, LLM interface, retrieval budget, access policy, provenance, relevance labels, and latency targets.

## Preconditions
Maintain a baseline RAG system and define answer-quality, citation, latency, and security metrics.

## Context to inspect
Entity linking quality, graph freshness, path fan-out, vector indexes, ontology semantics, authorization boundaries, token limits, and failure cases.

## Core knowledge
Graph RAG should retrieve evidence, not manufacture truth. Entity resolution and relation semantics determine retrieval quality. Multi-hop expansion must be bounded and ranked. Provenance should accompany graph-derived context so generated answers can cite or explain evidence.

## Procedure
1. Classify question types that benefit from graph retrieval.
2. Link query mentions to candidate graph entities with confidence.
3. Apply authorization before traversal.
4. Retrieve direct facts and bounded multi-hop neighborhoods.
5. Rank paths by relation relevance, provenance, freshness, and confidence.
6. Combine graph context with text/vector evidence when useful.
7. Serialize context compactly while preserving identifiers and provenance.
8. Instruct the generation layer to distinguish evidence from inference.
9. Evaluate entity-linking, retrieval recall, groundedness, citation accuracy, and answer quality separately.
10. Test ambiguous names, missing facts, conflicting sources, and adversarial prompts.
11. Monitor graph and embedding staleness.
12. Add fallback behavior when graph confidence is insufficient.

## Decision points
Use graph-first retrieval for relationship-heavy questions and vector-first retrieval for broad semantic discovery. Multi-hop reasoning is justified only when evaluation demonstrates value beyond direct retrieval.

## Common failure patterns
Unlimited neighborhood expansion; incorrect entity linking; leaking restricted neighbors; flattening provenance; treating inferred paths as confirmed facts; and evaluating only final answer style.

## Verification
Use labeled question sets, citation audits, adversarial authorization tests, retrieval ablations, and latency measurements. Verify answers remain grounded when evidence is incomplete.

## Expected output
A graph-RAG retrieval strategy, entity-linking and path-ranking logic, evaluation suite, and security/fallback controls.

## Stop conditions
Stop when the graph lacks trustworthy provenance, authorization cannot be enforced before retrieval, or quality claims lack representative evaluation data.