# Cache Boundary Analysis

## Purpose
Identify every authorization, identity, prompt, model, tool, and data boundary that can change an LLM response and therefore must influence cache isolation.

## When to use
Use before adding LLM response caching, semantic caching, shared prompt caches, or when investigating suspected cross-user/cross-tenant response leakage.

## Inputs
- LLM call sites and wrappers
- Authentication/authorization context
- Tenant/user identifiers
- Prompt construction code
- Retrieval/RAG data scopes
- Tool definitions and permissions
- Existing cache implementation and TTLs

## Preconditions
Repository access is read-only until the affected cache path is understood.

## Allowed tools
Repository search, static analysis, test runner, local scripts, cache inspection in non-production environments, official provider documentation.

## Constraints
Do not inspect or copy production secrets. Do not alter production cache entries. Do not infer tenant equivalence without evidence.

## Procedure
1. Locate each LLM invocation and cache read/write surrounding it.
2. Trace how system prompts, user prompts, response formats, model parameters, tool schemas, and retrieved context are assembled.
3. Trace identity and authorization inputs: tenant, user, role, subscription, locale, feature flags, data partition, and knowledge-base scope.
4. Classify each input as response-affecting, authorization-affecting, observability-only, or irrelevant.
5. Compare that classification with the current cache key.
6. Flag every response-affecting or authorization-affecting field missing from the key.
7. Inspect TTL and invalidation behavior for stale authorization or stale retrieval context.
8. Produce evidence for each finding using file paths, tests, config, traces, or reproducible examples.
9. Hand off key requirements to the cache-key design skill.

## Expected output
A boundary inventory containing field, source, reason, required isolation level, evidence, confidence, and risk if omitted.

## Verification
Every cache read and write path has a documented boundary inventory and no unexplained identity/data-scope field is excluded.

## Failure handling
If identity or authorization provenance cannot be established, mark the path BLOCKED and disable caching for that path rather than guessing.

## Stop conditions
Stop when a production change, permission increase, or cache purge would be required; request human approval first.
