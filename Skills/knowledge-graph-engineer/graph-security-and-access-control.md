# Graph Security and Access Control

## Purpose
Protect knowledge graph data, traversals, administrative operations, and derived results using least privilege and graph-aware authorization boundaries.

## When to use
Use when graphs contain sensitive entities, cross-tenant relationships, restricted provenance, regulated facts, or are exposed through APIs, analytics, or RAG systems.

## Inputs
Threat model, identity model, graph schema, sensitivity classifications, authorization policy, tenancy model, query interfaces, and audit requirements.

## Preconditions
Identify security principals, trust boundaries, data owners, and whether authorization is enforced in the graph engine, service layer, or both.

## Context to inspect
Roles, service accounts, query permissions, administrative privileges, tenant keys, derived indexes, exports, embeddings, logs, backups, and inference behavior.

## Core knowledge
Graph authorization is vulnerable to indirect disclosure: a user may infer restricted facts from paths, counts, embeddings, or neighboring nodes even when direct property access is blocked. Controls must cover raw facts and derived artifacts.

## Procedure
1. Classify sensitive node, edge, property, and provenance types.
2. Map principals to required graph operations.
3. Apply least privilege to read, write, schema, and administration actions.
4. Enforce tenant or domain boundaries on every traversal entry point.
5. Parameterize queries and constrain user-controlled traversal depth.
6. Protect sensitive derived views, embeddings, caches, and exports.
7. Prevent inference paths that bypass policy where material.
8. Separate operational and administrative credentials.
9. Audit privileged mutations and sensitive reads.
10. Test authorization using adversarial path and aggregation queries.
11. Rotate secrets and review stale principals.

## Decision points
Prefer engine-level controls for hard data boundaries and service-layer policy for contextual authorization; combine both for high-risk systems. Use physically separate graphs when logical controls cannot guarantee isolation.

## Common failure patterns
Securing properties but not relationships; shared admin credentials; cross-tenant traversal leaks; unauthorized embeddings; unrestricted graph query endpoints; and logs containing sensitive query results.

## Verification
Run positive and negative authorization tests, cross-tenant traversal attempts, derived-data checks, audit-log review, and privilege enumeration.

## Expected output
A graph security model, access policies, tested enforcement, audit coverage, and documented residual risks.

## Stop conditions
Stop when policy ownership is unclear, required controls are unsupported by the platform, or changes affect regulated access without approval.