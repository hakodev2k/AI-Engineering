# Memory Taxonomy and Modeling

## Purpose
Define a durable memory model that separates user facts, preferences, episodic events, task state, summaries, and inferred knowledge.

## When to use
Use when designing or refactoring AI memory schemas, especially when a single generic memory table has become ambiguous.

## Inputs
Memory requirements, representative conversations, identity model, retrieval patterns, retention policy, downstream consumers.

## Preconditions
Know which memory classes are durable and which are session-scoped.

## Context to inspect
Current schemas, metadata, embeddings, timestamps, confidence fields, provenance, user-edit flows, and deletion semantics.

## Core knowledge
Different memory classes have different lifecycles and truth semantics. A preference can change; an episode is historical; a derived summary is lossy; task state may expire quickly. Modeling them identically creates stale or misleading context.

## Procedure
1. Enumerate memory categories from real use cases.
2. Define required fields per category.
3. Add provenance, confidence, timestamps, and scope.
4. Define mutable versus append-only records.
5. Specify update and supersession rules.
6. Define retention and expiration behavior.
7. Separate source content from derived representations.
8. Add versioning for schema and extraction logic.
9. Validate the model against retrieval scenarios.
10. Document invariants and ownership.

## Decision points
Prefer explicit typed memory when behaviors differ materially. Use a common envelope only for shared metadata such as tenant, user, provenance, and timestamps.

## Common failure patterns
One undifferentiated memory type; no provenance; treating summaries as ground truth; no temporal semantics; storing mutable facts append-only without supersession.

## Verification
Verify representative memories can be stored, updated, retrieved, expired, and deleted without semantic ambiguity.

## Expected output
A versioned memory taxonomy and schema specification.

## Stop conditions
Stop when memory classes cannot be mapped to distinct lifecycle or truth rules.