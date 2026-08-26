# Access-Controlled Retrieval

## Purpose
Ensure RAG never retrieves or exposes content the requesting principal is not authorized to access.

## When to use
Use for enterprise, multi-tenant, private, regulated, or personalized corpora.

## Inputs
Identity claims, authorization model, document ACLs, group memberships, tenancy rules, retrieval backend capabilities.

## Context to inspect
Inspect source ACL semantics, inheritance, revocation latency, group expansion, cache keys, index filters, and citation endpoints.

## Core knowledge
Authorization must be enforced before content reaches generation. Prompt instructions are not an access-control mechanism. All derived caches and indexes inherit the sensitivity of source data.

## Procedure
1. Define principal and resource authorization semantics.
2. Preserve source ACLs during ingestion with stable identities.
3. Resolve group/role membership using authoritative identity data.
4. Apply fail-closed retrieval filters.
5. Enforce authorization again when fetching full source content if applicable.
6. Partition caches by security context.
7. Propagate revocations and deletions within a defined SLA.
8. Test cross-tenant and privilege-change scenarios.
9. Audit denied and anomalous access without logging sensitive content unnecessarily.
10. Threat-model indirect leakage through snippets, counts, citations, and generated text.

## Decision points
Choose index-time partitioning for strong isolation when operationally feasible; query-time ACL filtering offers flexibility but must be supported efficiently and correctly.

## Common failure patterns
Post-generation filtering; stale group membership; globally shared semantic cache; missing ACLs treated as public; citations bypassing authorization.

## Verification
Run adversarial authorization tests, revocation tests, cache-isolation tests, and tenant-boundary integration tests.

## Expected output
A fail-closed retrieval path with auditable authorization guarantees.

## Stop conditions
Stop deployment when ACL propagation or enforcement cannot be proven.