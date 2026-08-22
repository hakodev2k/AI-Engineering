# Persisted Operations

## Purpose
Use persisted GraphQL operations to improve governance, caching, observability, and protection for controlled client ecosystems.

## When to use
Use for first-party web/mobile clients, high-volume APIs, or environments where arbitrary production query text should be constrained.

## Inputs
Client release process, operation documents, registry capability, deployment workflow, cache/CDN architecture, and compatibility requirements.

## Context to inspect
Inspect operation hashing, registration flow, unknown-hash behavior, client fallback, schema checks, version retention, and rollout ordering.

## Core knowledge
Persisted operations identify approved query documents by stable IDs/hashes. They can reduce request size and enable allowlisting, but require lifecycle coordination between client, registry, and server.

## Procedure
1. Determine whether allowlisting or automatic persistence is needed.
2. Normalize and hash operation documents consistently.
3. Define registration and lookup workflow.
4. Validate registered operations against target schema.
5. Coordinate server and client rollout ordering.
6. Define behavior for unknown or expired operation IDs.
7. Retain versions needed by deployed clients.
8. Integrate operation identity with telemetry and cost budgets.
9. Protect registration endpoints and CI credentials.
10. Test rollback and old-client scenarios.

## Decision points
Use strict allowlisting for controlled clients and sensitive production surfaces. Automatic persisted queries improve bandwidth/cacheability but do not provide the same governance unless registration is restricted.

## Common failure patterns
Deleting operations still used by mobile clients, inconsistent hashing, insecure runtime registration, fallback that bypasses allowlisting, and deploying schema changes without registry validation.

## Verification
Run current and older supported clients, unknown-hash cases, rollback scenarios, and schema compatibility checks.

## Expected output
A version-aware persisted-operation lifecycle integrated with deployment and telemetry.

## Stop conditions
Stop if client release cadence or rollback requirements cannot be reconciled with operation retention.