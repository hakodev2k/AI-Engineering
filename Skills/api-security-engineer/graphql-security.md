# GraphQL Security

## Purpose
Secure GraphQL APIs against authorization bypass, excessive query cost, schema exposure risks, batching abuse, and resolver-level data leaks while preserving GraphQL flexibility.

## When to use
Use for new GraphQL services, schema expansion, federation, privileged mutations, public GraphQL endpoints, or performance/security incidents involving complex queries.

## Inputs
Schema, resolver code, authorization policies, federation topology, query limits, introspection policy, persisted-query configuration, production traffic profiles.

## Preconditions
Understand caller identities, field sensitivity, object ownership, and the maximum acceptable execution cost of a request.

## Context to inspect
Resolvers, data loaders, nested fields, mutations, directives, introspection, aliases, fragments, batching, federation boundaries, subscriptions, and error formatting.

## Core knowledge
Authorization must be enforced at the object/field operation that owns the decision, not inferred from schema visibility. Query depth alone is insufficient; aliases, list cardinality, fragments, and resolver cost can amplify work. GraphQL error responses can leak internal details if unfiltered.

## Procedure
1. Map sensitive types, fields, and mutations to authorization requirements.
2. Review resolver-level object and tenant checks.
3. Define query depth, complexity, alias, batch, and list-size limits.
4. Bound pagination and expensive relationship traversal.
5. Decide production introspection policy based on threat model rather than obscurity.
6. Restrict or validate persisted queries where appropriate.
7. Review federation trust and downstream identity propagation.
8. Sanitize errors while retaining correlation IDs.
9. Test unauthorized nested-field access and cross-tenant references.
10. Stress-test high-complexity valid queries and batching patterns.

## Decision points
Use persisted queries when clients are controlled and tighter operation governance is valuable. Keep introspection enabled when operational benefits outweigh low security value of hiding schema; do not treat disabling it as primary protection.

## Common failure patterns
Top-level authorization only, unlimited aliases, unbounded nested lists, trusting gateway authorization for entity resolvers, exposing stack traces, and assuming data loaders enforce authorization.

## Verification
Execute field-level negative tests, complexity tests, cross-tenant queries, malicious batching, and federation boundary tests. Confirm resource use remains bounded.

## Expected output
A GraphQL security policy with resolver authorization, complexity controls, safe errors, federation rules, and adversarial tests.

## Stop conditions
Escalate when resolver ownership is unclear, query cost cannot be estimated or bounded, or federation identity semantics are inconsistent.