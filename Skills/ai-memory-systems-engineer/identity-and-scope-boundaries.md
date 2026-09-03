# Identity and Scope Boundaries

## Purpose
Design identity, tenant, workspace, conversation, and agent boundaries so memories are never retrieved across unauthorized scopes.

## When to use
Use when adding multi-user, multi-tenant, team, or shared-agent memory.

## Inputs
Authentication model, authorization rules, tenant structure, sharing semantics, memory schema, retrieval APIs.

## Preconditions
Know the authoritative user and tenant identifiers and how impersonation or service accounts work.

## Context to inspect
Auth claims, session creation, storage keys, indexes, cache keys, retrieval filters, background jobs, exports, and deletion flows.

## Core knowledge
Memory isolation is a security boundary. Embedding similarity, caches, global indexes, and derived summaries can bypass naive tenant separation unless scope is enforced at every storage and retrieval layer.

## Procedure
1. Map all identity dimensions.
2. Define canonical scope fields.
3. Establish authorization rules for each memory class.
4. Enforce scope during writes.
5. Enforce scope before similarity or keyword retrieval.
6. Include scope in cache and materialization keys.
7. Audit background processing and reindexing.
8. Test cross-tenant and cross-user denial cases.
9. Define shared-memory ownership and revocation.
10. Document invariants.

## Decision points
Prefer server-enforced scope predicates over client-provided filters. Use separate physical stores only when regulatory or blast-radius requirements justify operational complexity.

## Common failure patterns
Global vector search followed by filtering; trusting user-supplied tenant IDs; shared cache keys; orphaned shared memories after access revocation.

## Verification
Run negative authorization tests proving unauthorized identities cannot infer, retrieve, enumerate, or update memories outside their scope.

## Expected output
A memory isolation model with enforced scope rules and security tests.

## Stop conditions
Stop when authoritative identity or sharing semantics are ambiguous.