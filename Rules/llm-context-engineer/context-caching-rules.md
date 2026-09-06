# Context Caching Rules

## Purpose
Reuse expensive context safely without serving stale, unauthorized, or incompatible content.

## Scope
Retrieval caches, assembled-context caches, summaries, embeddings, and cache invalidation.

## MUST
- Cache keys MUST include every input dimension that can change context semantics.
- Cached context MUST retain provenance, version, and creation time.
- Invalidation MUST cover source updates, permission changes, schema changes, and model-visible policy changes when relevant.
- Cache hits MUST be observable separately from fresh retrieval.

## MUST NOT
- MUST NOT share scoped cached context across incompatible users, tenants, or projects.
- MUST NOT use stale cached content beyond defined freshness requirements.
- MUST NOT cache generated summaries without linking them to the source version they summarize.

## SHOULD
- Prefer bounded TTLs for volatile sources.
- Measure cache benefit and correctness before expanding cache scope.

## Exceptions
Exceptions require documented freshness and isolation guarantees.

## Verification
Inspect cache keys, invalidation tests, TTLs, provenance metadata, and cache-hit traces.