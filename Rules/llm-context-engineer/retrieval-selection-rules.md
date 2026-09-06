# Retrieval Selection Rules

## Purpose
Select context evidence that is relevant, authoritative, diverse, and appropriate to the task.

## Scope
Query construction, candidate retrieval, ranking, deduplication, and source selection.

## MUST
- Retrieval MUST reflect the current task and known constraints.
- Selected evidence MUST preserve source identity and provenance.
- Ranking logic MUST distinguish relevance, authority, and freshness where those differ.
- Duplicate passages MUST be controlled so they do not dominate context.
- Important factual claims MUST prefer authoritative evidence when available.

## MUST NOT
- Retrieval score MUST NOT be treated as proof of correctness.
- Irrelevant passages MUST NOT be included solely because they match keywords.
- Incompatible source versions MUST NOT be mixed silently.

## SHOULD
- Query expansion SHOULD target missing concepts rather than repeat equivalent searches.
- Retrieval SHOULD preserve evidence diversity when multiple sources materially improve confidence.

## Exceptions
Exceptions require documented task-specific rationale and verification.

## Verification
Review retrieval traces, relevance judgments, source metadata, duplicate rates, and evaluation sets.