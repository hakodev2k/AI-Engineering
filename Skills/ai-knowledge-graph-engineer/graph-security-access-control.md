# Graph Security and Access Control

## Purpose
Protect graph data and traversals so users, services, and AI systems can access only authorized entities, relationships, properties, and inferred knowledge.

## When to use
Use when graphs contain tenant, personal, confidential, regulated, or role-sensitive information, especially when graph data feeds LLM context.

## Inputs
Authorization policy, tenant model, graph schema, identities/roles, sensitive-data classifications, query patterns, threat model.

## Preconditions
Authentication is established independently of graph query generation.

## Context to inspect
Database privileges, row/node/edge policies, application filters, graph gateway, RAG retrieval, caches, embeddings, exports, audit logs.

## Core knowledge
Graph traversal can leak sensitive information indirectly through edges, counts, inferred relationships, embeddings, or cached neighborhoods. Prompt instructions are not authorization controls. Enforcement should happen before sensitive graph content reaches an LLM.

## Procedure
1. Classify sensitive node, edge, and property types.
2. Map principals to explicit authorization rules.
3. Enforce tenant boundaries at the lowest practical layer.
4. Restrict traversal predicates and result fields.
5. Apply authorization before graph-RAG context construction.
6. Review inferred relationships for information leakage.
7. Partition or encrypt sensitive stores where justified.
8. Audit privileged queries and exports.
9. Test cross-tenant and privilege-escalation scenarios.
10. Verify caches and embeddings do not bypass policy.

## Decision points
Use database-native controls for hard boundaries where supported; supplement with application policy for contextual rules. Fail closed on ambiguous identity or policy resolution.

## Common failure patterns
Authorization only in UI code, unrestricted text-to-query, post-retrieval filtering, shared caches leaking neighborhoods, overprivileged service accounts, and inference exposing hidden relationships.

## Verification
Run positive and negative authorization tests, cross-tenant probes, export tests, and RAG-context inspections with audit evidence.

## Expected output
A graph authorization design, enforced policies, threat tests, audit coverage, and documented residual risks.

## Stop conditions
Escalate when access rules cannot be enforced before retrieval or when existing graph architecture makes tenant isolation unreliable.